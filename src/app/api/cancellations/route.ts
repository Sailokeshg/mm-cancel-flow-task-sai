import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { getMockUser } from '@/lib/mockUser'

type Body = {
  subscription_id?: string
  reason?: string
  accepted_downsell?: boolean
  accepted_price?: number
  accepted?: boolean
}

export async function POST(req: Request) {
  const user = getMockUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: Body = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  // Resolve subscription id: prefer provided, otherwise find user's active subscription
  let subscriptionId: string | null = body.subscription_id ?? null

  if (subscriptionId) {
    // verify it exists
    const { data: subCheck, error: subCheckErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('id', subscriptionId)
      .limit(1)

    if (subCheckErr) return NextResponse.json({ error: subCheckErr.message }, { status: 500 })

    if (!subCheck || subCheck.length === 0) {
      // invalid provided id — drop it so we can try to find one for the user
      subscriptionId = null
    }
  }

  if (!subscriptionId) {
    const { data: subsForUser, error: subsErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (subsErr) return NextResponse.json({ error: subsErr.message }, { status: 500 })

    if (!subsForUser || subsForUser.length === 0) {
      return NextResponse.json({ error: 'no subscription found for user; please provide subscription_id' }, { status: 400 })
    }

    subscriptionId = subsForUser[0].id
  }

  // check existing cancellation for user
  const { data: existing, error: selErr } = await supabaseAdmin
    .from('cancellations')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)

  if (selErr) {
    return NextResponse.json({ error: selErr.message }, { status: 500 })
  }

  let variant = 'A'
  if (existing && existing.length > 0) {
    variant = existing[0].downsell_variant
  } else {
    // secure RNG
    variant = crypto.randomInt(0, 2) === 0 ? 'A' : 'B'

    const { error: insertErr } = await supabaseAdmin.from('cancellations').insert({
      user_id: user.id,
      subscription_id: subscriptionId,
      downsell_variant: variant,
      reason: body.reason ?? null,
      accepted_downsell: body.accepted_downsell ?? false,
    })

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }
  }

  // if accepted (final cancellation), mark subscription pending_cancellation

  if (body.accepted) {
    const { error: updErr } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'pending_cancellation', updated_at: 'now()' })
      .eq('id', subscriptionId)

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }

    // also insert a final cancellation row (if not present) with accepted_downsell/ reason
    const { data: finalExisting } = await supabaseAdmin
      .from('cancellations')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    if (!finalExisting || finalExisting.length === 0) {
      await supabaseAdmin.from('cancellations').insert({
        user_id: user.id,
        subscription_id: body.subscription_id,
        downsell_variant: variant,
        reason: body.reason ?? null,
        accepted_downsell: body.accepted_downsell ?? false,
      })
    } else {
      // update existing record with final fields
      const existingRow = finalExisting[0];
      await supabaseAdmin.from('cancellations').update({
        reason: body.reason ?? existingRow.reason,
        accepted_downsell: body.accepted_downsell ?? existingRow.accepted_downsell,
      }).eq('id', existingRow.id)
    }
  }

  return NextResponse.json({ downsell_variant: variant })
}

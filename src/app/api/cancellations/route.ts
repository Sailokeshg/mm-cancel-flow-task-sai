import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { getMockUser } from '@/lib/mockUser'

// Basic input validation / sanitization helpers
function isValidUUID(id?: string | null) {
  if (!id) return false
  return /^[0-9a-fA-F-]{36}$/.test(id)
}

function sanitizeReason(input?: unknown) {
  if (!input) return null
  const s = String(input)
  // Trim and limit length to 500 chars to avoid abuse/XSS payloads
  const trimmed = s.trim().slice(0, 500)
  // Remove control characters
  return trimmed.replace(/[\u0000-\u001F\u007F]/g, '')
}

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

  if (subscriptionId && !isValidUUID(subscriptionId)) {
    subscriptionId = null
  }

  if (!subscriptionId) {
    const { data: subsForUser, error: subsErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status, monthly_price')
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

    const insertPayload = {
      user_id: user.id,
      subscription_id: subscriptionId,
      downsell_variant: variant,
      reason: sanitizeReason(body.reason) ?? null,
      accepted_downsell: Boolean(body.accepted_downsell ?? false),
    }

    const { error: insertErr } = await supabaseAdmin.from('cancellations').insert(insertPayload)

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }
  }

  // if accepted (final cancellation), mark subscription pending_cancellation

  if (body.accepted) {
    // Final cancellation: mark subscription pending_cancellation
    const { error: updErr } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'pending_cancellation', updated_at: new Date().toISOString() })
      .eq('id', subscriptionId)

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }

    // also insert or update a final cancellation row with accepted flags and reason
    const { data: finalExisting } = await supabaseAdmin
      .from('cancellations')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    const payload = {
      user_id: user.id,
      subscription_id: subscriptionId,
      downsell_variant: variant,
      reason: sanitizeReason(body.reason) ?? null,
      accepted_downsell: Boolean(body.accepted_downsell ?? false),
      created_at: new Date().toISOString(),
    }

    if (!finalExisting || finalExisting.length === 0) {
      const { error: iErr } = await supabaseAdmin.from('cancellations').insert(payload)
      if (iErr) return NextResponse.json({ error: iErr.message }, { status: 500 })
    } else {
      const existingRow = finalExisting[0]
      const { error: uErr } = await supabaseAdmin.from('cancellations').update({
        reason: payload.reason ?? existingRow.reason,
        accepted_downsell: payload.accepted_downsell ?? existingRow.accepted_downsell,
      }).eq('id', existingRow.id)
      if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ downsell_variant: variant })
}

export async function GET() {
  // Return the assigned variant (creating it deterministically on first visit)
  const user = getMockUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  // try to find an existing cancellation row
  const { data: existing, error: selErr } = await supabaseAdmin
    .from('cancellations')
    .select('id, downsell_variant, subscription_id, created_at')
    .eq('user_id', user.id)
    .limit(1)

  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })

  if (existing && existing.length > 0) {
    const row = existing[0]
    // fetch subscription price for convenience
    const { data: subRow } = await supabaseAdmin
      .from('subscriptions')
      .select('id, monthly_price')
      .eq('id', row.subscription_id)
      .limit(1)

    const monthly_price = subRow && subRow.length > 0 ? subRow[0].monthly_price : null

  const response: Record<string, unknown> = { downsell_variant: row.downsell_variant }
    if (monthly_price != null) {
      response.monthly_price = monthly_price
      if (row.downsell_variant === 'B') {
        response.downsell_price = Math.max(0, monthly_price - 1000)
      }
    }

    return NextResponse.json(response)
  }

  // assign deterministically and persist
  const variant = crypto.randomInt(0, 2) === 0 ? 'A' : 'B'

  // find user's subscription to associate
  const { data: subsForUser, error: subsErr } = await supabaseAdmin
    .from('subscriptions')
    .select('id, monthly_price')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (subsErr) return NextResponse.json({ error: subsErr.message }, { status: 500 })
  if (!subsForUser || subsForUser.length === 0) {
    return NextResponse.json({ error: 'no subscription found for user' }, { status: 400 })
  }

  const subscription_id = subsForUser[0].id
  const monthly_price = subsForUser[0].monthly_price

  const { error: insertErr } = await supabaseAdmin.from('cancellations').insert({
    user_id: user.id,
    subscription_id,
    downsell_variant: variant,
    reason: null,
    accepted_downsell: false,
    created_at: new Date().toISOString(),
  })

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  const resp: { downsell_variant: string; monthly_price: number; downsell_price?: number } = {
    downsell_variant: variant,
    monthly_price,
  }

  if (variant === 'B') {
    resp.downsell_price = Math.max(0, monthly_price - 1000)
  }

  return NextResponse.json(resp)
}

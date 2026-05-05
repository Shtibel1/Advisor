/**
 * Twilio WhatsApp Webhook → Voiceflow Dialog API
 *
 * REQUIRED ENV VARIABLES:
 *   VOICEFLOW_API_KEY  – from https://creator.voiceflow.com → Settings → API Keys
 *
 * TWILIO WEBHOOK:
 *   Point your Twilio WhatsApp sandbox/number "WHEN A MESSAGE COMES IN" to:
 *   https://<your-domain>/api/whatsapp   (HTTP POST)
 *
 * NOTE: Replies are sent via TwiML response (no Twilio SDK needed for sending).
 */

import { NextRequest, NextResponse } from 'next/server'

const VOICEFLOW_RUNTIME = 'https://general-runtime.voiceflow.com'

interface VoiceflowTrace {
  type: string
  payload?: {
    message?: string
    [key: string]: unknown
  }
}

/** Return a TwiML <Message> response so Twilio delivers it automatically. */
function twimlReply(body: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${body}</Message></Response>`
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse the URL-encoded body that Twilio sends
  let formData: URLSearchParams
  try {
    const rawBody = await req.text()
    formData = new URLSearchParams(rawBody)
  } catch (err) {
    console.error('[whatsapp] Failed to parse body:', err)
    return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 })
  }

  const userMessage = formData.get('Body')?.trim()
  const from = formData.get('From') // e.g. "whatsapp:+972501234567"

  console.log('[whatsapp] Incoming message from:', from, '| body:', userMessage)

  if (!userMessage || !from) {
    console.error('[whatsapp] Missing Body or From. formData keys:', Array.from(formData.keys()))
    return NextResponse.json({ error: 'Missing Body or From fields' }, { status: 400 })
  }

  // 2. Validate required environment variables
  const { VOICEFLOW_API_KEY } = process.env

  if (!VOICEFLOW_API_KEY) {
    console.error('[whatsapp] Missing env var: VOICEFLOW_API_KEY')
    return NextResponse.json({ error: 'Server misconfiguration: missing VOICEFLOW_API_KEY' }, { status: 500 })
  }

  // 3. Use the sender's WhatsApp number as the unique Voiceflow userID
  const userID = encodeURIComponent(from)

  try {
    // 4. Call the Voiceflow Dialog API (Interact endpoint)
    console.log('[whatsapp] Calling Voiceflow for userID:', userID)
    const voiceflowRes = await fetch(
      `${VOICEFLOW_RUNTIME}/state/user/${userID}/interact`,
      {
        method: 'POST',
        headers: {
          Authorization: VOICEFLOW_API_KEY,
          'Content-Type': 'application/json',
          versionID: 'production',
        },
        body: JSON.stringify({
          action: { type: 'text', payload: userMessage },
          config: { variables: { channel: 'whatsapp' } },
        }),
      }
    )

    if (!voiceflowRes.ok) {
      const errorText = await voiceflowRes.text()
      console.error('[whatsapp] Voiceflow error:', voiceflowRes.status, errorText)
      return twimlReply('מצטער, שגיאה בעיבוד הבקשה.')
    }

    // 5. Parse the trace array and collect all text-type messages
    const traces: VoiceflowTrace[] = await voiceflowRes.json()
    console.log('[whatsapp] Voiceflow traces:', JSON.stringify(traces))

    const replyText = traces
      .filter((trace) => trace.type === 'text' && trace.payload?.message)
      .map((trace) => trace.payload!.message!)
      .join('\n')

    const finalReply = replyText || 'מצטער, לא הצלחתי לעבד את בקשתך.'
    console.log('[whatsapp] Sending reply:', finalReply)

    // 6. Reply directly via TwiML (no Twilio SDK needed)
    return twimlReply(finalReply)
  } catch (error: unknown) {
    const err = error as Error
    console.error('[whatsapp] Unexpected error:', err?.message, err?.stack)
    return NextResponse.json({ error: 'Internal server error', detail: err?.message }, { status: 500 })
  }
}

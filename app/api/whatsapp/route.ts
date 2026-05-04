/**
 * Twilio WhatsApp Webhook → Voiceflow Dialog API
 *
 * SETUP:
 *   npm i twilio
 *
 * REQUIRED .env.local VARIABLES:
 *   TWILIO_ACCOUNT_SID     – from https://console.twilio.com (Account Info panel)
 *   TWILIO_AUTH_TOKEN      – from https://console.twilio.com (Account Info panel)
 *   TWILIO_PHONE_NUMBER    – your Twilio WhatsApp sender, e.g. "whatsapp:+14155238886"
 *   VOICEFLOW_API_KEY      – from https://creator.voiceflow.com → Settings → API Keys
 *
 * TWILIO WEBHOOK:
 *   Point your Twilio WhatsApp sandbox/number "WHEN A MESSAGE COMES IN" to:
 *   https://<your-domain>/api/whatsapp   (HTTP POST)
 */

import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const VOICEFLOW_RUNTIME = 'https://general-runtime.voiceflow.com'

interface VoiceflowTrace {
  type: string
  payload?: {
    message?: string
    [key: string]: unknown
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse the URL-encoded body that Twilio sends
  let formData: URLSearchParams
  try {
    const rawBody = await req.text()
    formData = new URLSearchParams(rawBody)
  } catch {
    return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 })
  }

  const userMessage = formData.get('Body')?.trim()
  const from = formData.get('From') // e.g. "whatsapp:+972501234567"

  if (!userMessage || !from) {
    return NextResponse.json({ error: 'Missing Body or From fields' }, { status: 400 })
  }

  // 2. Use the sender's WhatsApp number as the unique Voiceflow userID
  const userID = encodeURIComponent(from)

  // 3. Validate required environment variables
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, VOICEFLOW_API_KEY } =
    process.env

  const missingVars = [
    ['TWILIO_ACCOUNT_SID', TWILIO_ACCOUNT_SID],
    ['TWILIO_AUTH_TOKEN', TWILIO_AUTH_TOKEN],
    ['TWILIO_PHONE_NUMBER', TWILIO_PHONE_NUMBER],
    ['VOICEFLOW_API_KEY', VOICEFLOW_API_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missingVars.length > 0) {
    console.error('[whatsapp/route] Missing env vars:', missingVars.join(', '))
    return NextResponse.json(
      { error: 'Server misconfiguration', missing: missingVars },
      { status: 500 }
    )
  }

  try {
    // 4. Call the Voiceflow Dialog API (Interact endpoint)
    const voiceflowRes = await fetch(
      `${VOICEFLOW_RUNTIME}/state/user/${userID}/interact`,
      {
        method: 'POST',
        headers: {
          Authorization: VOICEFLOW_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: { type: 'text', payload: userMessage },
        }),
      }
    )

    if (!voiceflowRes.ok) {
      const errorText = await voiceflowRes.text()
      console.error('[whatsapp/route] Voiceflow error:', voiceflowRes.status, errorText)
      return NextResponse.json({ error: 'Voiceflow API error' }, { status: 502 })
    }

    // 5. Parse the trace array and collect all text-type messages
    const traces: VoiceflowTrace[] = await voiceflowRes.json()
    const replyText = traces
      .filter((trace) => trace.type === 'text' && trace.payload?.message)
      .map((trace) => trace.payload!.message!)
      .join('\n')

    const finalReply = replyText || 'מצטער, לא הצלחתי לעבד את בקשתך.' // fallback message

    // 6. Send the reply back to the user via Twilio WhatsApp
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: from,
      body: finalReply,
    })

    // 7. Return 200 OK so Twilio knows the webhook was handled successfully
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('[whatsapp/route] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

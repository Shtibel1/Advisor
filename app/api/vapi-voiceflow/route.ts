/**
 * Vapi Voice Webhook → Voiceflow Dialog API
 *
 * REQUIRED ENV VARIABLES:
 *   VOICEFLOW_API_KEY  – from https://creator.voiceflow.com → Settings → API Keys
 *
 * VAPI CONFIGURATION:
 *   Set your assistant's "Server URL" (Custom LLM / Webhook) to:
 *   https://<your-domain>/api/vapi-voiceflow   (HTTP POST)
 *
 * VAPI REQUEST BODY (assistant-request):
 *   {
 *     "message": {
 *       "type": "assistant-request",
 *       "call": { "id": "...", "phoneNumber": { "number": "+972..." }, ... },
 *       "content": "...",        // user utterance (some Vapi versions)
 *       "transcript": "..."     // user utterance (other Vapi versions)
 *     }
 *   }
 *
 * VAPI EXPECTED RESPONSE:
 *   { "message": { "role": "assistant", "content": "<reply text>" } }
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse the JSON body that Vapi sends
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch (err) {
    console.error('[vapi-voiceflow] Failed to parse JSON body:', err)
    return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 })
  }

  // 2. Extract the user's spoken message
  const message = body.message as Record<string, unknown> | undefined
  const userMessage =
    (message?.content as string | undefined)?.trim() ||
    (message?.transcript as string | undefined)?.trim()

  console.log('[vapi-voiceflow] Incoming message:', userMessage)

  if (!userMessage) {
    console.error('[vapi-voiceflow] Missing user message in body:', JSON.stringify(body))
    return NextResponse.json({ error: 'Missing user message content' }, { status: 400 })
  }

  // 3. Validate required environment variables
  const { VOICEFLOW_API_KEY } = process.env

  if (!VOICEFLOW_API_KEY) {
    console.error('[vapi-voiceflow] Missing env var: VOICEFLOW_API_KEY')
    return NextResponse.json(
      { error: 'Server misconfiguration: missing VOICEFLOW_API_KEY' },
      { status: 500 }
    )
  }

  // 4. Derive a stable userID for Voiceflow conversation state.
  //    Prefer the Vapi call ID so each call gets its own session.
  //    Fall back to the caller's phone number if available.
  const callObj = message?.call as Record<string, unknown> | undefined
  const callId = callObj?.id as string | undefined
  const phoneNumber =
    (callObj?.phoneNumber as Record<string, unknown> | undefined)?.number as string | undefined

  const userID = encodeURIComponent(callId ?? phoneNumber ?? 'vapi-anonymous')

  try {
    // 5. Call the Voiceflow Dialog API (Interact endpoint)
    console.log('[vapi-voiceflow] Calling Voiceflow for userID:', userID)
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
          config: { variables: { channel: 'vapi' } },
        }),
      }
    )

    if (!voiceflowRes.ok) {
      const errorText = await voiceflowRes.text()
      console.error('[vapi-voiceflow] Voiceflow error:', voiceflowRes.status, errorText)
      return NextResponse.json(
        { message: { role: 'assistant', content: 'מצטער, שגיאה בעיבוד הבקשה.' } },
        { status: 200 }
      )
    }

    // 6. Parse the trace array and collect all speak/text messages
    const traces: VoiceflowTrace[] = await voiceflowRes.json()
    console.log('[vapi-voiceflow] Voiceflow traces:', JSON.stringify(traces))

    const replyText = traces
      .filter(
        (trace) =>
          (trace.type === 'speak' || trace.type === 'text') && trace.payload?.message
      )
      .map((trace) => trace.payload!.message!)
      .join(' ')

    const finalReply = replyText || 'מצטער, לא הצלחתי לעבד את בקשתך.'
    console.log('[vapi-voiceflow] Sending reply:', finalReply)

    // 7. Return the response in the format Vapi expects
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: finalReply,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('[vapi-voiceflow] Unexpected error:', err?.message, err?.stack)
    return NextResponse.json(
      { error: 'Internal server error', detail: err?.message },
      { status: 500 }
    )
  }
}

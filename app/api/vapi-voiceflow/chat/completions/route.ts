/**
 * Vapi Voice Webhook → Voiceflow Dialog API  (OpenAI-compatible format)
 *
 * REQUIRED ENV VARIABLES:
 *   VOICEFLOW_API_KEY  – from https://creator.voiceflow.com → Settings → API Keys
 *
 * VAPI CONFIGURATION:
 *   Set your assistant's "Custom LLM Base URL" to:
 *   https://nadav-shtibel.com/api/vapi-voiceflow
 *   Vapi will automatically append /chat/completions → this route.
 *
 * VAPI REQUEST BODY (OpenAI-compatible):
 *   {
 *     "model": "...",
 *     "messages": [
 *       { "role": "system",    "content": "..." },
 *       { "role": "user",      "content": "מה שעות הפתיחה?" },
 *       { "role": "assistant", "content": "..." },
 *       { "role": "user",      "content": "<last utterance>" }
 *     ],
 *     "call": { "id": "...", "phoneNumber": { "number": "+972..." }, ... }
 *   }
 *
 * VAPI EXPECTED RESPONSE (OpenAI-compatible):
 *   {
 *     "choices": [{ "message": { "role": "assistant", "content": "..." }, "finish_reason": "stop" }]
 *   }
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

interface OpenAIMessage {
  role: string
  content: string
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

  console.log('[vapi-voiceflow] Received body:', JSON.stringify(body))

  // 2. Extract the last user message from the OpenAI-style messages array.
  //    Fall back to "היי" so Voiceflow triggers the opening flow on empty starts.
  const messages = (body.messages as OpenAIMessage[] | undefined) ?? []
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === 'user')?.content?.trim() || 'היי'

  console.log('[vapi-voiceflow] Last user message:', lastUserMessage)

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
  //    In OpenAI format Vapi puts `call` at the top level of the body.
  const callObj = body.call as Record<string, unknown> | undefined
  const callId = callObj?.id as string | undefined
  const phoneNumber =
    (callObj?.phoneNumber as Record<string, unknown> | undefined)?.number as string | undefined

  const userID = encodeURIComponent(callId ?? phoneNumber ?? 'vapi-anonymous')
  console.log('[vapi-voiceflow] Voiceflow userID:', userID)

  try {
    // 5. Call the Voiceflow Dialog API (Interact endpoint)
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
          action: { type: 'text', payload: lastUserMessage },
          config: { variables: { channel: 'vapi' } },
        }),
      }
    )

    if (!voiceflowRes.ok) {
      const errorText = await voiceflowRes.text()
      console.error('[vapi-voiceflow] Voiceflow error:', voiceflowRes.status, errorText)
      return NextResponse.json(
        {
          choices: [
            {
              message: { role: 'assistant', content: 'מצטער, שגיאה בעיבוד הבקשה.' },
              finish_reason: 'stop',
            },
          ],
        },
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

    // Strip emojis – TTS engines (e.g. ElevenLabs) can silently hang or skip
    // audio when they encounter emoji characters in the text.
    const stripped = (replyText || 'מצטער, לא הצלחתי לעבד את בקשתך.').replace(
      /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FEFF}\u{1F900}-\u{1F9FF}]/gu,
      ''
    ).trim()
    const finalReply = stripped || 'מצטער, לא הצלחתי לעבד את בקשתך.'
    console.log('[vapi-voiceflow] Sending reply:', finalReply)

    const responseId = callId ?? 'chatcmpl-vapi'
    const created = Math.floor(Date.now() / 1000)
    const isStream = body.stream === true

    // 7. Return SSE stream when Vapi requests it (stream: true), otherwise plain JSON.
    //    Vapi always sends stream: true with OpenAI-compatible Custom LLMs.
    if (isStream) {
      // Build the two required SSE chunks:
      //   chunk 1 – carries the full content in delta
      //   chunk 2 – finish signal (empty delta, finish_reason: 'stop')
      const chunk1 = JSON.stringify({
        id: responseId,
        object: 'chat.completion.chunk',
        created,
        model: 'voiceflow-bridge',
        choices: [{ index: 0, delta: { role: 'assistant', content: finalReply }, finish_reason: null }],
      })
      const chunk2 = JSON.stringify({
        id: responseId,
        object: 'chat.completion.chunk',
        created,
        model: 'voiceflow-bridge',
        choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
      })

      const sseBody = `data: ${chunk1}\n\ndata: ${chunk2}\n\ndata: [DONE]\n\n`

      return new NextResponse(sseBody, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Non-streaming fallback – full OpenAI chat.completion object
    return NextResponse.json({
      id: responseId,
      object: 'chat.completion',
      created,
      model: 'voiceflow-bridge',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: finalReply },
          logprobs: null,
          finish_reason: 'stop',
        },
      ],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
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

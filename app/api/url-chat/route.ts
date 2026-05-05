// Required env: OPENAI_API_KEY
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

// Context is capped to prevent token abuse — ~15k chars ≈ ~4k tokens
const MAX_CONTEXT_LENGTH = 15_000
// Chat history window kept to last 20 messages
const MAX_MESSAGES = 20

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 503 })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  let body: { messages: { role: string; content: string }[]; context: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages, context } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: '"messages" array is required' }, { status: 400 })
  }

  if (!context || typeof context !== 'string') {
    return NextResponse.json({ error: '"context" string is required' }, { status: 400 })
  }

  // Sanitise messages — only valid roles and string content
  const validRoles = ['user', 'assistant'] as const
  type ValidRole = (typeof validRoles)[number]

  const cleanMessages = messages
    .filter(
      (m): m is { role: ValidRole; content: string } =>
        (validRoles as readonly string[]).includes(m.role) && typeof m.content === 'string',
    )
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-MAX_MESSAGES)

  if (cleanMessages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  const safeContext = context.slice(0, MAX_CONTEXT_LENGTH)

  const systemPrompt = `You are a helpful customer support agent for the following website. \
Use the provided context to answer user questions in Hebrew. \
If the answer is not in the context, politely say you don't know based on the website data. \

Context:
${safeContext}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...cleanMessages],
      max_tokens: 1024,
      temperature: 0.4,
    })

    const reply = response.choices[0]?.message?.content ?? ''
    return NextResponse.json({ reply })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

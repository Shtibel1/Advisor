'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import { ChevronLeft, Link as LinkIcon, Bot, Send, Loader2, CheckCircle2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'

interface Message {
  role: Role
  content: string
}

type Phase = 'input' | 'loading' | 'chat'

// ─── Loading steps shown in sequence ─────────────────────────────────────────
const LOADING_STEPS = ['סורק את האתר...', 'מנתח נדונים...', 'מכין את הסוכן...']

// ─── Component ────────────────────────────────────────────────────────────────
export default function UrlAgentPage() {
  // ── State ──
  const [phase, setPhase] = useState<Phase>('input')
  const [url, setUrl] = useState('')
  const [context, setContext] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [scrapeError, setScrapeError] = useState('')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Auto-scroll chat to bottom ──
  useEffect(() => {
    if (phase === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, phase])

  // ── Rotate loading text every 1.8 s while in loading phase ──
  useEffect(() => {
    if (phase !== 'loading') return
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [phase])

  // ── Handlers ──
  const handleScrape = async (e: FormEvent) => {
    e.preventDefault()
    setScrapeError('')

    if (!url.trim()) return

    setPhase('loading')
    setLoadingStep(0)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.markdown) {
        throw new Error(data.error ?? 'שגיאה בסריקת האתר')
      }

      setContext(data.markdown)
      setMessages([])
      setPhase('chat')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'שגיאה לא צפויה'
      setScrapeError(msg)
      setPhase('input')
    }
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    try {
      const res = await fetch('/api/url-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, context }),
      })

      const data = await res.json()

      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? 'שגיאה בקבלת תשובה')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'שגיאה לא צפויה'
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ שגיאה: ${msg}` },
      ])
    } finally {
      setIsSending(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 font-sans text-white">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            חזרה לאתר הראשי
          </Link>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            LIVE DEMO
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">

        {/* ══════════════════════════════════════════════════
            INPUT PHASE
        ══════════════════════════════════════════════════ */}
        {phase === 'input' && (
          <div className="flex flex-col items-center text-center">
            {/* Icon badge */}
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <Bot className="h-10 w-10 text-cyan-400" />
            </div>

            <h1 className="mb-3 text-4xl font-bold tracking-tight">
              דמו: סוכן ידע מותאם אישית
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
              הזינו את כתובת האתר שלכם, וה-AI ילמד אותו תוך שניות ויהפוך לנציג שירות חכם.
            </p>

            <form
              onSubmit={handleScrape}
              className="w-full max-w-xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* URL Input */}
                <div className="relative flex-1">
                  <LinkIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pr-10 pl-4 text-sm text-white placeholder-slate-500 outline-none ring-0 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-95 disabled:opacity-50"
                >
                  <Bot className="h-4 w-4" />
                  סרוק אתר ובנה סוכן
                </button>
              </div>

              {/* Error message */}
              {scrapeError && (
                <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {scrapeError}
                </p>
              )}
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            LOADING PHASE
        ══════════════════════════════════════════════════ */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            {/* Spinner ring */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
              <Bot className="h-8 w-8 text-cyan-400" />
            </div>

            {/* Animated step text */}
            <p
              key={loadingStep}
              className="animate-pulse text-xl font-semibold text-cyan-300"
            >
              {LOADING_STEPS[loadingStep]}
            </p>

            <p className="text-sm text-slate-500">
              זה עלול לקחת מספר שניות...
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            CHAT PHASE
        ══════════════════════════════════════════════════ */}
        {phase === 'chat' && (
          <div className="flex flex-col gap-4">
            {/* Success banner */}
            <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
              <p className="text-sm text-green-300">
                <span className="font-semibold">הסוכן מוכן!</span> נסו לשאול שאלות על העסק שלכם.
              </p>
              <button
                onClick={() => { setPhase('input'); setUrl(''); setContext(''); setMessages([]) }}
                className="mr-auto text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
              >
                סריקה חדשה
              </button>
            </div>

            {/* Message list */}
            <div className="flex h-[480px] flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-600">
                  <Bot className="h-10 w-10" />
                  <p className="text-sm">שאלו את הסוכן כל שאלה על האתר שסרקתם</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm bg-cyan-600 text-white'
                        : 'rounded-tl-sm bg-slate-800 text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {isSending && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="שאלו שאלה על האתר..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isSending}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="flex items-center justify-center rounded-xl bg-cyan-600 p-3 text-white transition hover:bg-cyan-500 active:scale-95 disabled:opacity-40"
                aria-label="שלח שאלה"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

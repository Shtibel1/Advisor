'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import { Brain, Shield, ChevronLeft, MessageSquare, Sparkles, CheckCircle2, Link as LinkIcon, Bot, Send, Loader2, Globe, Zap } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'
interface Message { role: Role; content: string }
type Phase = 'input' | 'loading' | 'chat'

// ─── Loading steps cycled during scraping ─────────────────────────────────────
const LOADING_STEPS = ['סורק את האתר...', 'מנתח תוכן...', 'מכין את הסוכן...']

// ─── Phrases that indicate the AI lacks sufficient context ───────────────────
const LOW_CONTEXT_SIGNALS = [
  'אין לי מידע',
  'אינני יודע',
  'איני יודע',
  "לא מצאתי",
  'לא נמצא',
  'לא ידוע לי',
  'אין באפשרותי',
  'מומלץ לבדוק',
  'ממליץ לבדוק',
  'ממליצה לבדוק',
  'ליצור קשר עם שירות הלקוחות',
  'לא מופיע',
  'לא מצוין',
  "i don't know",
  'not in the context',
]

function isLowContext(text: string): boolean {
  const lower = text.toLowerCase()
  return LOW_CONTEXT_SIGNALS.some(s => lower.includes(s.toLowerCase()))
}

// ─── Capability badges shown under the hero ─────────────────────────────────
const CAPABILITIES = [
  'סריקת אתר בזמן אמת',
  'תשובות מדויקות מהתוכן',
  'שיחה טבעית בעברית',
]

export default function RagDemoPage() {
  // ── Phase state ──
  const [phase, setPhase] = useState<Phase>('input')
  const [url, setUrl] = useState('')
  const [scannedUrl, setScannedUrl] = useState('')
  const [context, setContext] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [scrapeError, setScrapeError] = useState('')

  // ── Chat state ──
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Auto-scroll to latest message ──
  useEffect(() => {
    if (phase === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, phase])

  // ── Cycle loading text every 1.8 s ──
  useEffect(() => {
    if (phase !== 'loading') return
    const id = setInterval(() => setLoadingStep(p => (p + 1) % LOADING_STEPS.length), 1800)
    return () => clearInterval(id)
  }, [phase])

  // ── Scrape handler ──
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
      if (!res.ok || !data.markdown) throw new Error(data.error ?? 'שגיאה בסריקת האתר')
      setContext(data.markdown)
      setScannedUrl(url.trim())
      setMessages([])
      setPhase('chat')
    } catch (err: unknown) {
      setScrapeError(err instanceof Error ? err.message : 'שגיאה לא צפויה')
      setPhase('input')
    }
  }

  // ── Chat send handler ──
  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSending) return
    const next: Message[] = [...messages, { role: 'user', content: input.trim() }]
    setMessages(next)
    setInput('')
    setIsSending(true)
    try {
      const res = await fetch('/api/url-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, context }),
      })
      const data = await res.json()
      if (!res.ok || !data.reply) throw new Error(data.error ?? 'שגיאה בקבלת תשובה')
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err: unknown) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err instanceof Error ? err.message : 'שגיאה'}` }])
    } finally {
      setIsSending(false)
    }
  }

  const handleReset = () => {
    setPhase('input')
    setUrl('')
    setScannedUrl('')
    setContext('')
    setMessages([])
    setScrapeError('')
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0A1628] font-assistant text-white">

      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            חזרה לאתר הראשי
          </Link>
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            LIVE DEMO
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* ══════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════ */}
        <section className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <Brain className="h-10 w-10 text-blue-400" />
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-white">דמו: </span>
            <span className="bg-gradient-to-l from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              סוכן ידע ארגוני
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-400">
            הזינו כתובת אתר — ה-AI יסרוק אותו תוך שניות ויהפוך לנציג שירות חכם שעונה על שאלות מהתוכן.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {CAPABILITIES.map((cap) => (
              <span
                key={cap}
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {cap}
              </span>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            MAIN DEMO AREA — two-column split layout
        ══════════════════════════════════════════════════ */}
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="flex flex-col gap-4">

            {/* Input phase: instructions panel */}
            {phase === 'input' && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Globe className="h-4 w-4 text-blue-400" />
                  איך זה עובד?
                </div>
                <ol className="flex flex-col gap-3 text-xs leading-relaxed text-slate-400">
                  <li className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold">1</span>הזינו כתובת אתר תקינה</li>
                  <li className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold">2</span>המערכת סורקת את דף הנחיתה בעזרת Firecrawl</li>
                  <li className="flex gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold">3</span>ה-AI מקבל את התוכן כהקשר ועונה בעברית</li>
                </ol>
              </div>
            )}

            {/* Loading phase: progress panel */}
            {phase === 'loading' && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  מעבד...
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  הסריקה עשויה לקחת עד 15 שניות בהתאם לגודל האתר.
                </p>
              </div>
            )}

            {/* Chat phase: scanned site info + reset */}
            {phase === 'chat' && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  מקור הידע
                </div>
                <div className="mb-4 truncate rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">
                  {scannedUrl}
                </div>
                <p className="mb-4 text-xs leading-relaxed text-slate-500">
                  הסוכן מכיר את תוכן האתר שסרקת. שאלו כל שאלה הקשורה לעסק.
                </p>
                <button
                  onClick={handleReset}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 text-xs text-slate-400 transition hover:border-blue-500/40 hover:text-blue-300"
                >
                  סרוק אתר אחר
                </button>
              </div>
            )}

            {/* Trust badge — always visible */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300/80">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p>
                בסביבת ייצור תוכלו לחבר מסמכים פנימיים, CRM, ומקורות נתונים נוספים.
              </p>
            </div>
          </aside>

          {/* ── RIGHT PANEL — dynamic content ── */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 shadow-2xl shadow-blue-900/20">

            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-white/8 bg-white/3 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                {phase === 'chat' ? 'סוכן הידע — פעיל' : 'סוכן ידע מותאם אישית'}
              </div>
            </div>

            {/* ── INPUT PHASE ── */}
            {phase === 'input' && (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center" style={{ minHeight: '520px' }}>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <Bot className="h-10 w-10 text-blue-400" />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-white">הזינו כתובת אתר</h2>
                  <p className="text-sm text-slate-500">ה-AI יסרוק אותו ויהפוך מיד לנציג שירות</p>
                </div>

                <form onSubmit={handleScrape} className="w-full max-w-md">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <LinkIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="url"
                        required
                        placeholder="https://example.com"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pr-10 pl-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95"
                    >
                      <Bot className="h-4 w-4" />
                      בנה סוכן
                    </button>
                  </div>

                  {scrapeError && (
                    <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                      {scrapeError}
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* ── LOADING PHASE ── */}
            {phase === 'loading' && (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center" style={{ minHeight: '520px' }}>
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-blue-400" />
                  <Bot className="h-8 w-8 text-blue-400" />
                </div>
                <p key={loadingStep} className="animate-pulse text-xl font-semibold text-blue-300">
                  {LOADING_STEPS[loadingStep]}
                </p>
                <p className="text-sm text-slate-500">זה עלול לקחת מספר שניות...</p>
              </div>
            )}

            {/* ── CHAT PHASE ── */}
            {phase === 'chat' && (
              <div className="flex flex-1 flex-col" style={{ minHeight: '520px' }}>
                {/* Success banner */}
                <div className="flex items-center gap-3 border-b border-white/5 bg-emerald-500/5 px-5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-xs text-emerald-300">
                    <span className="font-semibold">הסוכן מוכן!</span> נסו לשאול שאלות על העסק.
                  </p>
                </div>

                {/* Message list */}
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-600">
                      <Sparkles className="h-8 w-8" />
                      <p className="text-sm">שאלו כל שאלה על האתר שסרקתם</p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'rounded-tr-sm bg-blue-600 text-white'
                            : 'rounded-tl-sm bg-slate-800 text-slate-200'
                        }`}>
                          {msg.content}
                        </div>
                      </div>

                      {/* Upsell hint — shown when the AI signals it lacks context */}
                      {msg.role === 'assistant' && isLowContext(msg.content) && (
                        <div className="flex justify-end">
                          <div className="flex max-w-[80%] items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/8 px-3 py-2 text-xs text-blue-300">
                            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                            <span>
                              <span className="font-semibold">טיפ:</span> בסביבת ייצור אפשר לחבר מסמכים פנימיים, CRM ומקורות נתונים נוספים — כך הסוכן יענה על כל שאלה.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

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
                <form onSubmit={handleSend} className="flex gap-2 border-t border-white/5 p-3">
                  <input
                    type="text"
                    placeholder="שאלו שאלה על האתר..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isSending}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="flex items-center justify-center rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-500 active:scale-95 disabled:opacity-40"
                    aria-label="שלח"
                  >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* ── Footer strip ── */}
      <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-slate-600">
        דמו טכנולוגי בלבד · &copy; {new Date().getFullYear()} Nadav AI
      </footer>
    </div>
  )
}

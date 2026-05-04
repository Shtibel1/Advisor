'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Files, Brain, Shield, ChevronLeft, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react'

// ─── Mock knowledge-base sources shown in the sidebar ───────────────────────
const MOCK_SOURCES = [
  { icon: Files,  label: 'ספר נהלי חברה 2024',          pages: '142 עמ׳' },
  { icon: Files,  label: 'מדריך שירות לקוחות',           pages: '88 עמ׳'  },
  { icon: Files,  label: 'סיכומי ישיבות הנהלה Q1-Q2',   pages: '34 עמ׳'  },
  { icon: Files,  label: 'מדיניות גיוס ומשאבי אנוש',    pages: '61 עמ׳'  },
  { icon: Shield, label: 'מדריך אבטחת מידע ופרטיות',    pages: '27 עמ׳'  },
  { icon: Brain,  label: 'בסיס ידע מוצרים ותמחור',      pages: '119 עמ׳' },
]

// ─── Suggested questions the user can click ─────────────────────────────────
const SUGGESTED_QUESTIONS = [
  'מהי מדיניות החופשות של החברה?',
  'איך מטפלים בלקוח שמתלונן על איחור?',
  'מה תהליך קבלת עובד חדש?',
  'מהם תנאי ההחזר על מוצר פגום?',
  'מי אחראי על אישור רכש מעל 10,000 ₪?',
  'מהי מדיניות ה-Remote Work?',
]

// ─── Capability badges shown under the hero ─────────────────────────────────
const CAPABILITIES = [
  'חיפוש סמנטי על פני מסמכים',
  'תשובות מדויקות עם ציטוטי מקור',
  'עדכון בסיס הידע בזמן אמת',
]

export default function RagDemoPage() {
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null)

  const handleQuestionClick = (q: string) => {
    // Visual feedback — highlights the clicked question for 1.5 s
    setCopiedQuestion(q)
    setTimeout(() => setCopiedQuestion(null), 1500)
    // If your iframe exposes a postMessage API, you can send the question here:
    // const iframe = document.getElementById('chat-iframe') as HTMLIFrameElement
    // iframe?.contentWindow?.postMessage({ type: 'prefill', text: q }, '*')
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0A1628] font-assistant text-white"
    >
      {/* ── Top navigation bar ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            {/* ChevronLeft points logically "back" even in RTL */}
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
          {/* Icon badge */}
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
            בואו לראות איך ה-AI סורק את מסמכי החברה ועונה על שאלות מורכבות בשניות.
          </p>

          {/* Capability badges */}
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
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">

          {/* ── LEFT (RTL: right side visually) — Knowledge-base Sources ── */}
          <aside className="flex flex-col gap-4">
            {/* Header */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Files className="h-4 w-4 text-blue-400" />
                בסיס הידע בדמו זה
              </div>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                המסמכים הבאים נטענו למערכת ה-RAG. הסוכן מחפש עליהם בזמן אמת וצוטט מקור לכל תשובה.
              </p>

              {/* Source list */}
              <ul className="flex flex-col gap-2">
                {MOCK_SOURCES.map(({ icon: Icon, label, pages }) => (
                  <li
                    key={label}
                    className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/4 px-3 py-2.5 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400/70 transition-colors group-hover:text-blue-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500">{pages}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badge */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300/80">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p>
                כל המסמכים בדמו זה הם <strong className="text-amber-300">פיקטיביים</strong>. בסביבת ייצור, המערכת מחוברת למסמכים האמיתיים שלך בצורה מאובטחת.
              </p>
            </div>
          </aside>

          {/* ── RIGHT — Chat Interface (iframe embed) ── */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 shadow-2xl shadow-blue-900/20">
            {/* Chat window title-bar */}
            <div className="flex items-center gap-3 border-b border-white/8 bg-white/3 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                סוכן הידע הארגוני — Maya AI
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                CHAT EMBED AREA
                ─────────────────────────────────────────────────────────────
                Replace the placeholder <div> below with your embed code.

                Option A — Dify.ai iframe:
                  <iframe
                    id="chat-iframe"
                    src="https://YOUR_DIFY_APP_URL/chat/XXXX"
                    allow="microphone"
                    className="h-full w-full border-0"
                  />

                Option B — Chatbase script embed:
                  Add the Chatbase <script> tag to this page's <head> via
                  Next.js <Script> component in layout.tsx, then render:
                  <div id="chatbase-bubble-button" className="h-full w-full" />

                Option C — Any other iframe:
                  <iframe
                    id="chat-iframe"
                    src="PASTE_YOUR_EMBED_URL_HERE"
                    className="h-full w-full border-0"
                    title="סוכן ידע ארגוני"
                  />
            ───────────────────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center" style={{ minHeight: '520px' }}>
              {/* ↓↓↓ DELETE THIS PLACEHOLDER BLOCK and paste your iframe above ↓↓↓ */}
              <div className="rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 p-8">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-blue-400" />
                <p className="text-sm font-medium text-blue-300">אזור הטמעת הצ׳אטבוט</p>
                <p className="mt-1 text-xs text-slate-500">
                  החלף בלוק זה ב-<code className="rounded bg-white/10 px-1 py-0.5 text-blue-300">&lt;iframe&gt;</code> של Dify / Chatbase
                </p>
              </div>
              {/* ↑↑↑ END OF PLACEHOLDER ↑↑↑ */}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SUGGESTED QUESTIONS
        ══════════════════════════════════════════════════ */}
        <section className="rounded-2xl border border-white/8 bg-white/3 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Sparkles className="h-4 w-4 text-blue-400" />
            שאלות מוצעות — לחץ כדי להשתמש
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => {
              const isActive = copiedQuestion === q
              return (
                <button
                  key={q}
                  onClick={() => handleQuestionClick(q)}
                  className={`
                    group flex items-center gap-2 rounded-full border px-4 py-2 text-sm
                    transition-all duration-200
                    ${isActive
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                      : 'border-white/10 bg-white/4 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-200'
                    }
                  `}
                >
                  {isActive ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-blue-400" />
                  )}
                  {q}
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-xs text-slate-600">
            * לחיצה על שאלה מדגישה אותה. כאשר תחבר את ה-iframe תוכל להעביר אליו את הטקסט דרך postMessage API.
          </p>
        </section>

      </main>

      {/* ── Footer strip ── */}
      <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-slate-600">
        דמו טכנולוגי בלבד · כל הנתונים פיקטיביים · &copy; {new Date().getFullYear()} Nadav AI
      </footer>
    </div>
  )
}

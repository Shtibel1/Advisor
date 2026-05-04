'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Smartphone, QrCode, ChevronRight, CheckCircle2 } from 'lucide-react'

// ─── WhatsApp config ──────────────────────────────────────────────────────────
// Replace with your actual WhatsApp business number (international format, no +)
const WA_NUMBER = '972501234567'
const WA_MESSAGE = encodeURIComponent('היי, הגעתי מהדמו באתר')
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`

// ─── Sample conversation ──────────────────────────────────────────────────────
const CHAT_MESSAGES = [
  {
    id: 1,
    from: 'user' as const,
    text: 'היי, אפשר לקבוע שיחת ייעוץ?',
    time: '10:31',
  },
  {
    id: 2,
    from: 'bot' as const,
    text: 'בשמחה! 😊 אני בודק את היומן...\nיש לי מחר ב-10:00 או ב-14:00.\nמה נוח לך?',
    time: '10:31',
  },
  {
    id: 3,
    from: 'user' as const,
    text: 'ב-10:00 בבקשה',
    time: '10:32',
  },
  {
    id: 4,
    from: 'bot' as const,
    text: 'מעולה! ✅ קבעתי לך שיחה מחר ב-10:00.\nתקבל תזכורת שעה לפני. להתראות! 🙌',
    time: '10:32',
  },
]

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    icon: QrCode,
    title: 'שלב 1 — סרקו את הברקוד',
    desc: 'סרקו את קוד ה-QR עם המצלמה של הטלפון, או לחצו על הכפתור הירוק למטה כדי לפתוח את השיחה ישירות.',
  },
  {
    icon: MessageCircle,
    title: 'שלב 2 — שלחו את ההודעה',
    desc: 'תוצג הודעה מוכנה: "היי, הגעתי מהדמו באתר". פשוט לחצו שלח — זה הכל.',
  },
  {
    icon: Smartphone,
    title: 'שלב 3 — שוחחו עם הנציג',
    desc: 'נסו לשאול על מחירים, לבקש לתזמן פגישה, או לברר את שעות הפעילות — הכל בשפה טבעית.',
  },
]

// ─── Typing animation dots ────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </span>
  )
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    // Animate messages appearing one by one
    const timeouts: ReturnType<typeof setTimeout>[] = []

    CHAT_MESSAGES.forEach((msg, i) => {
      const delay = i * 1200 + (i > 0 && CHAT_MESSAGES[i - 1].from === 'bot' ? 600 : 0)

      if (msg.from === 'bot') {
        // Show typing indicator before bot messages
        timeouts.push(
          setTimeout(() => setShowTyping(true), delay - 700 < 0 ? 0 : delay - 700)
        )
      }

      timeouts.push(
        setTimeout(() => {
          setShowTyping(false)
          setVisibleCount(i + 1)
        }, delay)
      )
    })

    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      {/* Phone outer shell */}
      <div className="relative rounded-[2.5rem] border-[6px] border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-[#075e54]">
          <span className="text-[10px] text-white/80 font-medium">9:41</span>
          <div className="flex gap-1">
            <span className="w-3 h-[6px] rounded-sm bg-white/70 text-[0px]">sig</span>
            <span className="w-2 h-[6px] rounded-sm bg-white/70 text-[0px]">sig</span>
          </div>
        </div>

        {/* WhatsApp header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#075e54]">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight" dir="rtl">
              נציג AI – Nadav AI
            </p>
            <p className="text-[11px] text-emerald-300 leading-none">מחובר</p>
          </div>
        </div>

        {/* Chat area */}
        <div
          className="flex flex-col gap-2 px-2 py-3 min-h-[340px] bg-[#0a1628] bg-opacity-90 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          dir="rtl"
        >
          {CHAT_MESSAGES.slice(0, visibleCount).map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  relative max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed shadow-md
                  animate-in fade-in slide-in-from-bottom-2 duration-300
                  ${
                    msg.from === 'user'
                      ? 'bg-[#005c4b] text-white rounded-tr-sm'
                      : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                  }
                `}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-right text-[9px] mt-1 ${
                    msg.from === 'user' ? 'text-emerald-300/70' : 'text-slate-400/70'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {showTyping && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-3 py-2.5">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-2 py-2 bg-[#1a2535] border-t border-slate-700/50">
          <div className="flex-1 bg-slate-700/60 rounded-full px-3 py-1.5">
            <p className="text-[11px] text-slate-500">הקלידו הודעה...</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2 bg-[#1a2535]">
          <div className="w-16 h-1 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* Glow effect behind phone */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-[#25D366] rounded-full scale-75 translate-y-8" />
    </div>
  )
}

// ─── QR Placeholder ───────────────────────────────────────────────────────────
function QRCodePlaceholder() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative p-3 bg-white rounded-2xl shadow-lg shadow-black/40">
        {/* SVG QR code visual placeholder */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="QR Code placeholder"
        >
          {/* Top-left finder */}
          <rect x="10" y="10" width="40" height="40" rx="4" fill="#111827" />
          <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
          <rect x="22" y="22" width="16" height="16" rx="1" fill="#111827" />
          {/* Top-right finder */}
          <rect x="90" y="10" width="40" height="40" rx="4" fill="#111827" />
          <rect x="96" y="16" width="28" height="28" rx="2" fill="white" />
          <rect x="102" y="22" width="16" height="16" rx="1" fill="#111827" />
          {/* Bottom-left finder */}
          <rect x="10" y="90" width="40" height="40" rx="4" fill="#111827" />
          <rect x="16" y="96" width="28" height="28" rx="2" fill="white" />
          <rect x="22" y="102" width="16" height="16" rx="1" fill="#111827" />
          {/* Data modules — decorative pattern */}
          {[60, 70, 80, 60, 70, 80, 60, 70, 80].map((x, i) => (
            <rect
              key={`r${i}`}
              x={x}
              y={[10, 10, 10, 25, 25, 25, 40, 40, 40][i]}
              width="8"
              height="8"
              rx="1.5"
              fill="#111827"
            />
          ))}
          {[10, 25, 40, 10, 25, 40, 10, 25, 40].map((y, i) => (
            <rect
              key={`c${i}`}
              x={[10, 10, 10, 55, 55, 55, 80, 80, 80][i]}
              y={y + 60}
              width="8"
              height="8"
              rx="1.5"
              fill="#111827"
            />
          ))}
          {/* Center data block */}
          {[55, 68, 81, 55, 68, 81, 55, 68, 81].map((x, i) => (
            <rect
              key={`m${i}`}
              x={x}
              y={[55, 55, 55, 68, 68, 68, 81, 81, 81][i]}
              width="9"
              height="9"
              rx="1.5"
              fill={[true, false, true, false, true, false, true, false, true][i] ? '#111827' : 'white'}
            />
          ))}
        </svg>
        {/* WhatsApp icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center">
        *עדכנו את מספר הטלפון בקוד לברקוד אמיתי
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WhatsAppDemoPage() {
  return (
    <main
      className="min-h-screen bg-slate-950 text-white font-assistant"
      dir="rtl"
      lang="he"
    >
      {/* ── Back nav ──────────────────────────────────────────────────────── */}
      <nav className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          חזרה לעמוד הבית
        </Link>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-12 pb-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-1.5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
          </span>
          <span className="text-sm font-medium text-[#25D366]">דמו חי — נסו עכשיו</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          דמו:{' '}
          <span className="text-[#25D366]">צ׳אט-בוט שירות ומכירה</span>
          <br className="hidden sm:block" />
          {' '}ב-WhatsApp
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          סרקו את הברקוד או לחצו על הכפתור כדי להתחיל שיחה עם נציג ה-AI שלנו ישירות
          בוואטסאפ שלכם.
        </p>
      </section>

      {/* ── Main 2-col content ────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* ── RIGHT: Instructions ───────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Steps */}
            <div className="flex flex-col gap-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={i}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-[#25D366]/40 transition-colors"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center mt-0.5">
                      <Icon className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* QR + CTA grouped */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center gap-6">
              <QRCodePlaceholder />

              <div className="w-full flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px bg-slate-700" />
                  <span className="text-xs text-slate-500">או</span>
                  <div className="flex-1 h-px bg-slate-700" />
                </div>

                {/* WhatsApp CTA button */}
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group w-full inline-flex items-center justify-center gap-3
                    rounded-2xl px-6 py-4 font-bold text-base text-white
                    bg-[#25D366] hover:bg-[#20bc5a] active:scale-[0.98]
                    shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40
                    transition-all duration-200
                  "
                >
                  <MessageCircle className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-6" />
                  התחל שיחה בוואטסאפ
                </a>

                {/* Trust line */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]/70" />
                  ללא הרשמה · פרטיותך נשמרת · חוויה מלאה בדקה אחת
                </div>
              </div>
            </div>
          </div>

          {/* ── LEFT: Phone mockup ────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-6 lg:sticky lg:top-24">
            {/* Section label */}
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-1">דוגמה לשיחה אמיתית עם הבוט</p>
              <p className="text-xs text-slate-600">ההודעות מופיעות בהדרגה — בדיוק כמו שיחה אמיתית</p>
            </div>

            <PhoneMockup />

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['עברית מלאה', 'זמין 24/7', 'תיאום פגישות', 'מחירים ואינפו'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Bottom CTA banner ────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-3xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/10 via-slate-900 to-slate-950 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            רוצים בוט כזה לעסק שלכם?
          </h2>
          <p className="text-slate-400 mb-7 max-w-md mx-auto">
            אנחנו בונים סוכני WhatsApp מותאמים אישית — שירות לקוחות, מכירות, ותיאום
            פגישות. מוכן לייצור בתוך ימים.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2.5 rounded-2xl px-8 py-3.5
              font-bold text-white bg-[#25D366] hover:bg-[#20bc5a]
              shadow-lg shadow-[#25D366]/25 transition-all duration-200
              active:scale-[0.98]
            "
          >
            <MessageCircle className="w-5 h-5" />
            שוחחו איתנו עכשיו
          </a>
        </div>
      </section>
    </main>
  )
}

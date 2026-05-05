'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, ChevronRight, Mic, PhoneCall, PhoneOff, Voicemail } from 'lucide-react'

// ─── Config ───────────────────────────────────────────────────────────────────
// The WhatsApp / Vapi phone number the voice agent is listening on
const AGENT_PHONE = '+972-53-388-3204'
const AGENT_PHONE_HREF = 'tel:+972533883204'

// ─── Sample transcript ────────────────────────────────────────────────────────
const TRANSCRIPT: { from: 'agent' | 'user'; text: string; time: string }[] = [
  { from: 'agent', text: 'שלום! אני נציגת ה-AI של Nadav AI, במה אוכל לעזור?', time: '0:02' },
  { from: 'user', text: 'שלום, רציתי לדעת מה הי השירותים שאתם מציעים.', time: '0:06' },
  {
    from: 'agent',
    text: 'אנחנו בונים נציגי AI – צ׳אטבוטים לוואטסאפ, נציגות קוליות, ואוטומציות לעסקים. רוצה לשמוע על אחד מהם?',
    time: '0:10',
  },
  { from: 'user', text: 'כן, ספרי לי על הנציגה הקולית.', time: '0:18' },
  {
    from: 'agent',
    text: 'הנציגה הקולית עונה לשיחות טלפון 24/7, עונה על שאלות, מתזמנת פגישות, ומחברת ל-CRM שלכם. רוצה שנציג לכם דמו?',
    time: '0:22',
  },
  { from: 'user', text: 'בהחלט!', time: '0:35' },
  {
    from: 'agent',
    text: 'מצוין! אשמח לתאם שיחת היכרות. מה התאריך הנוח לכם?',
    time: '0:37',
  },
]

// ─── Sound-wave bars animation ────────────────────────────────────────────────
function SoundWave({ active }: { active: boolean }) {
  const bars = [3, 7, 5, 9, 4, 8, 6, 10, 5, 7, 3]
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {bars.map((h, i) => (
        <span
          key={i}
          className="rounded-full bg-violet-400 transition-all duration-300"
          style={{
            width: 3,
            height: active ? `${h * 3}px` : '4px',
            opacity: active ? 1 : 0.3,
            animation: active ? `bounce 0.8s ${i * 0.07}s infinite alternate ease-in-out` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  )
}

// ─── Call timer ───────────────────────────────────────────────────────────────
function CallTimer({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) { setSeconds(0); return }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return <span className="font-mono text-sm text-violet-300">{mm}:{ss}</span>
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [callActive, setCallActive] = useState(false)
  const [callEnded, setCallEnded] = useState(false)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    // Start call animation
    timeouts.push(setTimeout(() => setCallActive(true), 800))

    // Animate transcript
    let delay = 1400
    TRANSCRIPT.forEach((msg, i) => {
      if (msg.from === 'agent') {
        timeouts.push(setTimeout(() => setAgentSpeaking(true), delay - 500))
      }
      timeouts.push(
        setTimeout(() => {
          setAgentSpeaking(false)
          setVisibleCount(i + 1)
        }, delay)
      )
      delay += msg.text.length * 38 + 1000
    })

    // End call
    timeouts.push(setTimeout(() => { setCallActive(false); setCallEnded(true) }, delay + 500))

    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      {/* Phone shell */}
      <div className="relative rounded-[2.5rem] border-[6px] border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-[#1a0a2e]">
          <span className="text-[10px] text-white/60 font-medium">9:41</span>
          <div className="flex gap-1">
            <span className="w-3 h-[6px] rounded-sm bg-white/50 text-[0px]">sig</span>
            <span className="w-2 h-[6px] rounded-sm bg-white/50 text-[0px]">sig</span>
          </div>
        </div>

        {/* Call header */}
        <div className="flex flex-col items-center gap-1 px-4 py-4 bg-[#1a0a2e]">
          <div className="w-14 h-14 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center mb-1">
            <Mic className="w-7 h-7 text-violet-400" />
          </div>
          <p className="text-white text-sm font-bold">Nadav AI – נציגה קולית</p>
          <p className="text-[11px] text-violet-300">
            {callEnded ? 'השיחה הסתיימה' : callActive ? 'שיחה פעילה' : 'מתחבר...'}
          </p>
          <CallTimer running={callActive} />
        </div>

        {/* Sound wave */}
        <div className="flex justify-center py-2 bg-[#0f0620]">
          <SoundWave active={agentSpeaking} />
        </div>

        {/* Transcript area */}
        <div
          className="flex flex-col gap-2 px-2 py-3 min-h-[280px] bg-[#0a061a] overflow-hidden"
          dir="rtl"
        >
          {TRANSCRIPT.slice(0, visibleCount).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`
                  relative max-w-[88%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-md
                  ${
                    msg.from === 'user'
                      ? 'bg-violet-700/60 text-white rounded-tr-sm'
                      : 'bg-slate-700/80 text-slate-100 rounded-tl-sm'
                  }
                `}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`block text-right text-[9px] mt-1 ${msg.from === 'user' ? 'text-violet-300/60' : 'text-slate-400/60'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call controls */}
        <div className="flex items-center justify-center gap-8 px-4 py-4 bg-[#0f0620] border-t border-slate-700/40">
          <button aria-label="Mute" className="w-11 h-11 rounded-full bg-slate-700/60 flex items-center justify-center">
            <Mic className="w-5 h-5 text-slate-300" />
          </button>
          <button
            aria-label="End call"
            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
          <button aria-label="Voicemail" className="w-11 h-11 rounded-full bg-slate-700/60 flex items-center justify-center">
            <Voicemail className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2 bg-[#0f0620]">
          <div className="w-16 h-1 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* Glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-25 bg-violet-600 rounded-full scale-75 translate-y-8" />
    </div>
  )
}

// ─── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🕐', title: 'זמין 24/7', desc: 'עונה לכל שיחה, בכל שעה, ללא תורים ועיכובים.' },
  { icon: '📅', title: 'תיזמון פגישות', desc: 'מקשר ליומן ומתאם פגישות בזמן אמת.' },
  { icon: '🔗', title: 'אינטגרציה ל-CRM', desc: 'מעדכן את מאגר הלקוחות אוטומטית.' },
  { icon: '🌐', title: 'רב-לשוני', desc: 'עברית, אנגלית ועוד — ללא תוספת עלות.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VoiceAgentDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-assistant" dir="rtl" lang="he">

      {/* Back nav */}
      <nav className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          חזרה לעמוד הבית
        </Link>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
          </span>
          <span className="text-sm font-medium text-violet-400">דמו חי — נסו עכשיו</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          דמו:{' '}
          <span className="text-violet-400">נציגה קולית AI</span>
          <br className="hidden sm:block" />
          {' '}המחוברת לוואטסאפ
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          התקשרו למספר הבא וקבלו שיחה עם נציגת ה-AI — היא עונה, מסבירה, ומתאמת פגישות
          בזמן אמת.
        </p>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

          {/* RIGHT: Info + CTA */}
          <div className="flex flex-col gap-8">

            {/* CTA card */}
            <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-violet-500/40 transition-colors">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mt-0.5">
                <PhoneCall className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-3">התקשרו אל הנציגה</h3>
                <a
                  href={AGENT_PHONE_HREF}
                  className="
                    group w-full inline-flex items-center justify-center gap-3
                    rounded-2xl px-6 py-3.5 font-bold text-base text-white
                    bg-violet-600 hover:bg-violet-500 active:scale-[0.98]
                    shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40
                    transition-all duration-200
                  "
                >
                  <Phone className="w-5 h-5 shrink-0 transition-transform group-hover:-rotate-12" />
                  {AGENT_PHONE}
                </a>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  ללא הרשמה · פרטיותך נשמרת · שיחה בעברית
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-violet-500/30 transition-colors"
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* How it works note */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="font-bold text-white mb-3 text-sm">איך זה עובד?</h3>
              <ol className="flex flex-col gap-2 list-decimal list-inside text-sm text-slate-400 leading-relaxed">
                <li>מתקשרים למספר הנציגה</li>
                <li>הנציגה עונה תוך שניות ומברכת אתכם</li>
                <li>שואלים כל שאלה בשפה טבעית</li>
                <li>הנציגה מציעה לתאם פגישה — ומתאמת!</li>
              </ol>
            </div>
          </div>

          {/* LEFT: Phone mockup */}
          <div className="flex flex-col items-center gap-4 lg:sticky lg:top-24">
            <p className="text-xs text-slate-500 tracking-widest uppercase">סימולציית שיחה</p>
            <PhoneMockup />
            <p className="text-xs text-slate-600 text-center max-w-[280px]">
              הסימולציה מציגה שיחה לדוגמה. בשיחה אמיתית הנציגה מגיבה בזמן אמת.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

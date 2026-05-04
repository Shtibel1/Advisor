'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  DollarSign,
  MessageSquare,
  TrendingDown,
  Send,
  ChevronLeft,
  Loader2,
  Bot,
  User,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHART_DATA = [
  { month: 'ינו׳', הכנסות: 120000, הוצאות: 74000 },
  { month: 'פבר׳', הכנסות: 135000, הוצאות: 80000 },
  { month: 'מרץ', הכנסות: 142000, הוצאות: 118000 },
  { month: 'אפר׳', הכנסות: 128000, הוצאות: 76000 },
  { month: 'מאי', הכנסות: 138000, הוצאות: 85000 },
  { month: 'יוני', הכנסות: 145000, הוצאות: 82000 },
]

const SUMMARY_CARDS = [
  {
    label: 'הכנסות החודש',
    value: '₪145,000',
    change: '+5.1%',
    positive: true,
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
  },
  {
    label: 'הוצאות החודש',
    value: '₪82,000',
    change: '-3.5%',
    positive: true,
    icon: TrendingDown,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10 border-sky-400/20',
  },
  {
    label: 'רווח גולמי',
    value: '₪63,000',
    change: 'מרווח 43.4%',
    positive: true,
    icon: DollarSign,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
]

const SUGGESTED_PROMPTS = [
  'למה היו לנו כל כך הרבה הוצאות במרץ?',
  'האם אנחנו ברווחיות החודש?',
  'מי הספק שהוצאנו עליו הכי הרבה?',
  'מה צפי ההכנסות לרבעון הבא?',
  'מה סך ההכנסות מתחילת השנה?',
]

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ─── Custom Tooltip for Recharts ──────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm shadow-xl">
      <p className="mb-2 font-semibold text-white">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-bold">₪{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FinanceDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'שלום! אני האנליסט הפיננסי שלכם. טעינתי את נתוני הנהלת החשבונות של טכנולוגיות אלפא בע"מ לחצי השנה הראשונה של 2026. שאלו אותי כל שאלה על ההכנסות, ההוצאות, הספקים או הרווחיות.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/finance-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      })

      if (!res.ok) throw new Error('שגיאת שרת')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'מצטער, אירעה שגיאה בעיבוד הבקשה. אנא נסה שוב.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 font-assistant text-white">
      {/* ── Top Bar ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white">Financial Data Intelligence</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
              דמו
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
          >
            חזרה לדף הבית
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ── Main Split Layout ── */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row-reverse">

          {/* ══ RIGHT SIDE: Dashboard ══════════════════════════════════════════ */}
          <section className="flex flex-col gap-5 lg:w-[58%]">

            {/* Section header */}
            <div>
              <h1 className="text-2xl font-bold text-white">לוח בקרה פיננסי</h1>
              <p className="mt-1 text-sm text-slate-400">
                נתוני הנהלת חשבונות — ינואר–יוני 2026 · טכנולוגיות אלפא בע"מ
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SUMMARY_CARDS.map(card => {
                const Icon = card.icon
                return (
                  <div
                    key={card.label}
                    className={`rounded-2xl border p-4 ${card.bg}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-400">{card.label}</span>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{card.change}</p>
                  </div>
                )
              })}
            </div>

            {/* Bar Chart */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5">
              <h2 className="mb-1 font-semibold text-white">הכנסות מול הוצאות</h2>
              <p className="mb-5 text-xs text-slate-500">6 חודשים אחרונים · בש"ח</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={CHART_DATA} barCategoryGap="30%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `₪${(v / 1000).toFixed(0)}K`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: '13px', color: '#94a3b8', paddingTop: '12px' }}
                  />
                  <Bar dataKey="הכנסות" fill="#34d399" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="הוצאות" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Vendors mini-table */}
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-5">
              <h2 className="mb-4 font-semibold text-white">ספקים מובילים — H1 2026</h2>
              <div className="space-y-3">
                {[
                  { name: 'פרילנסרים', amount: '₪73,000', pct: 73, color: 'bg-emerald-500' },
                  { name: 'Google Ads', amount: '₪54,000', pct: 54, color: 'bg-sky-500' },
                  { name: 'שכירות משרד', amount: '₪48,000', pct: 48, color: 'bg-amber-500' },
                  { name: 'AWS', amount: '₪18,000', pct: 18, color: 'bg-purple-500' },
                  { name: 'ציוד משרדי', amount: '₪12,000', pct: 12, color: 'bg-rose-500' },
                ].map(v => (
                  <div key={v.name} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-sm text-slate-300">{v.name}</span>
                    <div className="flex-1 rounded-full bg-slate-700">
                      <div
                        className={`h-2 rounded-full ${v.color}`}
                        style={{ width: `${v.pct}%` }}
                      />
                    </div>
                    <span className="w-20 text-right text-sm font-semibold text-white">
                      {v.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ LEFT SIDE: AI Chat ════════════════════════════════════════════ */}
          <section className="flex flex-col lg:w-[42%]">
            <div className="flex h-full flex-col rounded-2xl border border-slate-700/60 bg-slate-800/50 overflow-hidden lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">

              {/* Chat header */}
              <div className="border-b border-slate-700 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">אנליסט פיננסי AI</h2>
                    <p className="text-xs text-slate-500">מחובר לנתוני iCount · מרץ 2026</p>
                  </div>
                  <div className="mr-auto flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">פעיל</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        msg.role === 'assistant'
                          ? 'bg-emerald-500/20'
                          : 'bg-slate-600'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <User className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-slate-700/60 text-slate-100 rounded-tr-sm'
                          : 'bg-emerald-600 text-white rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                      <Bot className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tr-sm bg-slate-700/60 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                      <span className="text-sm text-slate-400">מנתח נתונים...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested prompts */}
              <div className="border-t border-slate-700 px-4 pt-3 pb-2">
                <p className="mb-2 text-xs text-slate-500">שאלות מוצעות:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-slate-700 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="שאל שאלה על הנתונים הפיננסיים..."
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

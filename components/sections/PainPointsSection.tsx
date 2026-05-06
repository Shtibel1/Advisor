'use client'

import { CountUp } from '@/components/ui/CountUp'

const PAIN_POINTS = [
  {
    emoji: '⏳',
    title: 'הצוות שלך שורף שעות על עבודה שאפשר לבצע בה אוטומציה',
    desc: 'סיכומי פגישות, הכנת דוחות, מענה על שאלות חוזרות – כל שעה שהצוות מבזבז על זה היא שעה שלא הושקעה בצמיחה.',
    statTarget: 60,
    statSuffix: '%',
    statLabel: 'מזמן העבודה הולך לטיפול במידע במקום להחלטות',
  },
  {
    emoji: '📊',
    title: 'יש לך נתונים, אבל אין לך זמן להבין אותם',
    desc: 'המידע הפיננסי, השיווקי והתפעולי נמצא – אבל מפוזר, אי-אפשר לנתח אותו בזמן אמת, והזדמנויות עסקיות חולפות.',
    statTarget: 70,
    statSuffix: '%',
    statLabel: 'מהמנהלים מרגישים שהם מחליטים בלי תמונה מלאה',
  },
  {
    emoji: '💬',
    title: 'לקוחות מחכים לתשובה – ומתחרים שלך לא',
    desc: 'כל דקה שלקוח ממתין היא הזדמנות שהולכת לאיבוד. בעידן ה-AI, "ניצור קשר בקרוב" כבר לא מספיק.',
    statTarget: 3,
    statSuffix: 'x',
    statLabel: 'יותר סיכוי לאבד עסקה עם כל שעה של עיכוב בתגובה',
  },
]

export default function PainPointsSection() {
  return (
    <section id="pain-points" className="relative py-28 bg-gray-950 scroll-mt-16 overflow-hidden" dir="rtl">
      {/* subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-red-400 text-sm font-semibold uppercase tracking-widest mb-4">
            מכירים את זה?
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
            העסק שלך יכול להיות{' '}
            <span className="text-red-400">הרבה</span> יותר יעיל —<br className="hidden sm:block" />
            משהו מעכב אותו.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            אלה לא תחושות — אלה בעיות מדידות שעסקים כמו שלך חווים כל יום
          </p>
        </div>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PAIN_POINTS.map(({ emoji, title, desc, statTarget, statSuffix, statLabel }) => (
            <div
              key={title}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-5 hover:border-red-500/40 transition-colors duration-300"
            >
              {/* X mark */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold mt-0.5">
                  ✕
                </span>
                <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

              {/* Stat callout */}
              <div className="mt-auto pt-5 border-t border-gray-800">
                <CountUp target={statTarget} suffix={statSuffix} className="block text-3xl font-extrabold text-red-400" />
                <span className="text-xs text-gray-500 leading-snug">{statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bridge to solution */}
        <div className="relative text-center bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl px-8 py-10">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-3">מזהה את עצמך?</p>
          <p className="text-white text-2xl sm:text-3xl font-bold mb-2">
            עסקים חכמים לא עובדים <span className="line-through text-gray-600">קשה יותר</span> —
          </p>
          <p className="text-white text-2xl sm:text-3xl font-bold mb-8">
            הם בונים <span className="text-indigo-400">מערכות שעובדות בשבילם</span>.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-3 rounded-xl text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
          >
            בוא נתקן את זה עכשיו ←
          </a>
        </div>
      </div>
    </section>
  )
}

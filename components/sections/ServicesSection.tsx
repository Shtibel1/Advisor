'use client'

import Link from 'next/link'
import { DatabaseIcon, BotIcon, TrendingUpIcon, WhatsAppIcon, PhoneAgentIcon } from '@/components/ui/Icons'

const SERVICES = [
  {
    Icon: DatabaseIcon,
    gradientIcon: 'bg-gradient-to-br from-cyan-500 to-sky-600 shadow-cyan-500/20',
    gradientBar: 'bg-gradient-to-r from-cyan-400 to-sky-500',
    hoverBorder: 'hover:border-cyan-200',
    badgeColor: 'text-cyan-600',
    dotColor: 'bg-cyan-500',
    title: 'סוכן ידע ארגוני',
    badge: 'RAG \u2013 Retrieval Augmented Generation',
    desc: 'מנוע חיפוש AI על גבי כל המסמכים, הנהלים וניירות העמדה של הארגון. עובדים מקבלים תשובות מיידיות ומדויקות \u2013 בלי לחפש ידנית שעות.',
    features: [
      'חיפוש חכם על פני כל המסמכים בשניות',
      'אבטחת מידע מלאה – הנתונים נשארים אצלך',
      'עדכון אוטומטי של בסיס הידע',
    ],
    demoHref: '/demos/rag',
  },
  {
    Icon: BotIcon,
    gradientIcon: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20',
    gradientBar: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    hoverBorder: 'hover:border-blue-200',
    badgeColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    title: "צ'אט-בוט חכם לשירות ומכירה",
    badge: 'AI Customer Support & Sales',
    desc: "בוט שירות לקוחות אוטומטי המחובר ל-APIs העסקיים שלך \u2013 מלאי, תורים, הזמנות. עונה ומוכר 24/7, ללא מגבלת כמות שיחות.",
    features: [
      'אינטגרציה מלאה ל-CRM/ERP קיים',
      'מענה בעברית ברמה גבוהה ומותאם מותג',
      'ניתוב חכם לנציג אנושי לפי צורך',
    ],
    demoAction: () => {
      // @ts-expect-error voiceflow is injected by external script
      window.voiceflow?.chat?.open()
    },
  },
  {
    Icon: TrendingUpIcon,
    gradientIcon: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/20',
    gradientBar: 'bg-gradient-to-r from-violet-400 to-purple-500',
    hoverBorder: 'hover:border-violet-200',
    badgeColor: 'text-violet-600',
    dotColor: 'bg-violet-500',
    title: 'דוחות ותובנות אוטומטיים',
    badge: 'AI Financial & Data Intelligence',
    desc: 'חיבור מערכות הנהלת חשבונות (רווחית, iCount ועוד) למנוע AI לניתוח פיננסי בשפה טבעית. שאל שאלה עסקית \u2013 קבל תשובה מיידית.',
    features: [
      'סנכרון עם רווחית ו-iCount',
      'דוחות שבועיים/חודשיים באוטומציה מלאה',
      'ניתוח פיננסי בשפה טבעית',
    ],
    demoHref: '/demos/finance',
  },
  {
    Icon: WhatsAppIcon,
    gradientIcon: 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20',
    gradientBar: 'bg-gradient-to-r from-green-400 to-emerald-500',
    hoverBorder: 'hover:border-green-200',
    badgeColor: 'text-green-600',
    dotColor: 'bg-green-500',
    title: 'אוטומציית WhatsApp חכמה',
    badge: 'AI WhatsApp Automation',
    desc: 'ניהול שיחות מכירה, שירות ותיאום פגישות ישירות באפליקציה שהלקוחות שלך הכי אוהבים. ה-AI מבין הקשר, מנהל משא ומתן וסוגר קצוות \u2013 הכל בוואטסאפ.',
    features: [
      'זמינות 24/7 בערוץ התקשורת המרכזי בישראל',
      'תיאום פגישות וסנכרון ישיר ליומן (Google Calendar / Calendly)',
      'חיבור למערכת ה-CRM לעדכון סטטוס לידים בזמן אמת',
    ],
    demoHref: '/demos/whatsapp',
  },
  {
    Icon: PhoneAgentIcon,
    gradientIcon: 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20',
    gradientBar: 'bg-gradient-to-r from-orange-400 to-red-500',
    hoverBorder: 'hover:border-orange-200',
    badgeColor: 'text-orange-600',
    dotColor: 'bg-orange-500',
    title: 'נציגים קוליים מבוססי AI',
    badge: 'AI Voice Agents',
    desc: 'נציג וירטואלי שמנהל שיחות טלפון טבעיות לחלוטין. הבוט מתקשר ללידים חדשים בתוך דקות, מסנן אותם, עונה על שאלות וקובע פגישות עבור הצוות שלך.',
    features: [
      'טיוב לידים (Qualification) בשיחות יוצאות',
      'מענה אנושי וטבעי לשיחות נכנסות בעומסים',
      'תמלול וסיכום אוטומטי של כל שיחה לתוך ה-CRM',
    ],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">מה אני בונה</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">השירותים שלנו</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            חמישה פתרונות ליבה שמדליקים את המנוע של העסק שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
          {SERVICES.map(({ Icon, gradientIcon, gradientBar, hoverBorder, badgeColor, dotColor, title, badge, desc, features, demoHref, demoAction }) => (
            <div
              key={title}
              className={`relative bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-2xl ${hoverBorder} transition-all duration-300 overflow-hidden`}
            >
              <div className={`absolute top-0 inset-x-0 h-1 ${gradientBar}`} />
              <div className={`w-14 h-14 ${gradientIcon} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                <Icon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className={`text-xs font-semibold ${badgeColor} uppercase tracking-wider mb-4`}>{badge}</p>
              <p className="text-gray-500 leading-relaxed mb-6">{desc}</p>
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <span className={`w-1.5 h-1.5 ${dotColor} rounded-full flex-shrink-0 mt-1.5`} />
                    {f}
                  </li>
                ))}
              </ul>
              {demoHref && (
                <Link
                  href={demoHref}
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-cyan-500 bg-cyan-500/10 py-2.5 text-sm font-semibold text-cyan-600 transition-all hover:bg-cyan-500 hover:text-white"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                  </span>
                  נסו את הדמו החי
                </Link>
              )}
              {demoAction && (
                <button
                  onClick={demoAction}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-500/10 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-500 hover:text-white"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  פתחו את הצ׳אט החי
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

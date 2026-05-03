import { DatabaseIcon, BotIcon, TrendingUpIcon } from '@/components/ui/Icons'

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
  },
  {
    Icon: BotIcon,
    gradientIcon: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20',
    gradientBar: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    hoverBorder: 'hover:border-blue-200',
    badgeColor: 'text-blue-600',
    dotColor: 'bg-blue-500',
    title: "צ\u05f4אט-בוט חכם לשירות ומכירה",
    badge: 'AI Customer Support & Sales',
    desc: "בוט שירות לקוחות אוטומטי המחובר ל-APIs העסקיים שלך \u2013 מלאי, תורים, הזמנות. עונה ומוכר 24/7, ללא מגבלת כמות שיחות.",
    features: [
      'אינטגרציה מלאה ל-CRM/ERP קיים',
      'מענה בעברית ברמה גבוהה ומותאם מותג',
      'ניתוב חכם לנציג אנושי לפי צורך',
    ],
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
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">מה אנחנו בונים</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">השירותים שלנו</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            שלושה פתרונות ליבה שמדליקים את המנוע של העסק שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map(({ Icon, gradientIcon, gradientBar, hoverBorder, badgeColor, dotColor, title, badge, desc, features }) => (
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

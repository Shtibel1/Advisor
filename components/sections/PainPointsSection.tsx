import { ClockIcon, BarChartIcon, MessageIcon } from '@/components/ui/Icons'

const PAIN_POINTS = [
  {
    Icon: ClockIcon,
    colorBg: 'bg-red-100',
    colorText: 'text-red-600',
    title: 'עומס עבודה ידנית',
    desc: 'הצוות שלך מבלה שעות יקרות בסיכום מידע, הכנת דוחות ומענה על שאלות חוזרות – במקום להתמקד בצמיחה ובערך אמיתי.',
  },
  {
    Icon: BarChartIcon,
    colorBg: 'bg-amber-100',
    colorText: 'text-amber-600',
    title: 'תובנות נקברות בנתונים',
    desc: 'המידע הפיננסי, השיווקי והתפעולי קיים, אבל אין זמן לנתח אותו. הזדמנויות עסקיות חולפות ואתה רק מגיב בדיעבד.',
  },
  {
    Icon: MessageIcon,
    colorBg: 'bg-blue-100',
    colorText: 'text-blue-600',
    title: 'לקוחות ממתינים לתשובות',
    desc: 'זמני תגובה ארוכים = עסקאות שהולכות לאיבוד. בעידן ה-AI, לקוחות מצפים לתגובה מיידית ומדויקת, 24 שעות ביממה.',
  },
]

export default function PainPointsSection() {
  return (
    <section id="pain-points" className="py-24 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">מכירים את התסכולים האלה?</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            אלה הכאבים שמונעים מהעסק שלך לצמוח בקצב שהוא יכול
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PAIN_POINTS.map(({ Icon, colorBg, colorText, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 ${colorBg} ${colorText} rounded-xl flex items-center justify-center mb-6`}>
                <Icon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

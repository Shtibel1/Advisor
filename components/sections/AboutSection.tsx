import { CountUp } from '@/components/ui/CountUp'
import { ShieldIcon, CodeIcon, UsersIcon } from '@/components/ui/Icons'
import config from '@/data/siteConfig.json'

const DIFFERENTIATORS = [
  {
    Icon: ShieldIcon,
    colorClass: 'bg-cyan-500/20 text-cyan-400',
    title: 'אינטגרציות מאובטחות ומדרגיות',
    desc: 'אנחנו לא רק כותבים פרומפטים – אנחנו בונים אינטגרציות מאובטחות ישירות למערכות ה-CRM/ERP הקיימות שלך, עם כל הדרישות האבטחתיות.',
  },
  {
    Icon: CodeIcon,
    colorClass: 'bg-blue-500/20 text-blue-400',
    title: 'פתרונות מוכנים לייצור',
    desc: 'הקוד שאנחנו כותבים עולה ל-Production. מוניטורינג, אבטחה, ניהול שגיאות וביצועים – הכל מתוכנן מהיסוד בצורה מקצועית.',
  },
  {
    Icon: UsersIcon,
    colorClass: 'bg-violet-500/20 text-violet-400',
    title: 'ליווי מלא מהאפיון ועד ההפעלה',
    desc: 'מאפיון הצרכים העסקיים ועד הטמעה מלאה והדרכת הצוות. אנחנו נשארים לצדך גם לאחר השקת הפרויקט.',
  },
]

const STATS = [
  { target: config.yearsExperience,        suffix: '+',  label: 'שנות ניסיון בפיתוח',      color: 'text-cyan-400' },
  { target: config.projectsCompleted,      suffix: '+',  label: 'פרויקטים הושלמו',         color: 'text-blue-400' },
  { target: config.timeSavedPercent,       suffix: '%+', label: 'חיסכון ממוצע בזמן עבודה', color: 'text-violet-400' },
  { target: config.clientRecommendPercent, suffix: '%',  label: 'לקוחות ממליצים',           color: 'text-green-400' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0A1628] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* In RTL grid: first child = right column (text), second = left column (stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div>
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">למה לבחור בנו</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
              אנחנו בונים, לא רק מייעצים
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed mb-10">
              רוב יועצי ה-AI הרגילים ייתנו לך פרזנטציה ורשימת כלים. אנחנו ניגשים לשולחן עם ניסיון של{' '}
              <strong className="text-white">מפתח Full Stack Senior</strong> ומממשים את הפתרון מ-A עד Z &ndash;
              מאפיון, פיתוח, ועד הטמעה והדרכת הצוות.
            </p>

            <div className="space-y-8">
              {DIFFERENTIATORS.map(({ Icon, colorClass, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1.5">{title}</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { CountUp } from '@/components/ui/CountUp'
import { ShieldIcon, CodeIcon, UsersIcon } from '@/components/ui/Icons'
import config from '@/data/siteConfig.json'

const DIFFERENTIATORS = [
  {
    Icon: ShieldIcon,
    colorClass: 'bg-cyan-500/20 text-cyan-400',
    title: 'אינטגרציות מאובטחות ומדרגיות',
    desc: 'אני לא רק כותב פרומפטים – אני בונה אינטגרציות מאובטחות ישירות למערכות ה-CRM/ERP הקיימות שלך, עם כל הדרישות האבטחתיות.',
  },
  {
    Icon: CodeIcon,
    colorClass: 'bg-blue-500/20 text-blue-400',
    title: 'פתרונות מוכנים לייצור',
    desc: 'הקוד שאני כותב עולה ל-Production. מוניטורינג, אבטחה, ניהול שגיאות וביצועים – הכל מתוכנן מהיסוד בצורה מקצועית.',
  },
  {
    Icon: UsersIcon,
    colorClass: 'bg-violet-500/20 text-violet-400',
    title: 'ליווי מלא מהאפיון ועד ההפעלה',
    desc: 'מאפיון הצרכים העסקיים ועד הטמעה מלאה והדרכת הצוות. אני נשאר לצדך גם לאחר השקת הפרויקט.',
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
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">למה לבחור בי</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
              אני בונה, לא רק מייעץ
            </h2>

            {/* Personal Bio Card */}
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5 mb-8">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/40 flex-shrink-0">
                  <Image src="/image.png" alt="נדב שטיבל" fill className="object-cover object-top" sizes="64px" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">נדב שטיבל</p>
                  <p className="text-cyan-400 text-xs mt-0.5">Full Stack &amp; AI Developer</p>
                </div>
              </div>
              <p className="text-cyan-400 font-semibold text-sm mb-2">קצת עלי</p>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                אני נדב שטיבל, מפתח Full Stack Senior עם למעלה מ-5 שנות ניסיון בבניית מערכות מורכבות.
                לאחר שראיתי מקרוב כיצד עסקים מפספסים את הפוטנציאל האמיתי של ה-AI בגלל ייעוץ שלא קרקע, בחרתי להתמחץ בדיוק בזה.
                עד היום ליוויתי למעלה מ-10 עסקים ממגוון תחומים – ו-100% מהלקוחות ממליצים עליי לסביבתם.
              </p>
            </div>

            <p className="text-blue-200/70 text-lg leading-relaxed mb-10">
              רוב יועצי ה-AI הרגילים ייתנו לך פרזנטציה ורשימת כלים. אני ניגש לשולחן עם ניסיון של{' '}
              <strong className="text-white">מפתח Full Stack Senior</strong> ומממש את הפתרון מ-A עד Z &ndash;
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

          {/* Stats */}
          <div className="flex flex-col gap-6">
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
      </div>
    </section>
  )
}

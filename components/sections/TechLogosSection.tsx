import {
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiNextdotjs,
  SiNodedotjs,
  SiMake,
  SiN8N,
} from 'react-icons/si'
import { IconType } from 'react-icons'

const LOGOS: { Icon: IconType; label: string; hoverClass: string }[] = [
  { Icon: SiOpenai,       label: 'OpenAI',   hoverClass: 'hover:text-emerald-400' },
  { Icon: SiGooglegemini, label: 'Gemini',   hoverClass: 'hover:text-blue-400'    },
  { Icon: SiAnthropic,    label: 'Claude',   hoverClass: 'hover:text-orange-300'  },
  { Icon: SiNextdotjs,    label: 'Next.js',  hoverClass: 'hover:text-white'       },
  { Icon: SiNodedotjs,    label: 'Node.js',  hoverClass: 'hover:text-green-400'   },
  { Icon: SiMake,         label: 'Make',     hoverClass: 'hover:text-violet-400'  },
  { Icon: SiN8N,          label: 'n8n',      hoverClass: 'hover:text-red-400'     },
]

export default function TechLogosSection() {
  return (
    <section className="py-14 bg-[#0A1628]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400/50">
          Technologies &amp; Integrations
        </p>
        <p className="mt-1.5 text-gray-500 text-sm">
          טכנולוגיות שאנחנו מטמיעים ומחברים לתוך המערכות שלך
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {LOGOS.map(({ Icon, label, hoverClass }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 text-white/25 ${hoverClass} transition-colors duration-300 cursor-default`}
            >
              <Icon size={32} />
              <span className="text-[11px] tracking-wide font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

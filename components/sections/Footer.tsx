import Link from 'next/link'
import { LinkedInIcon } from '@/components/ui/Icons'

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] border-t border-blue-900/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* In RTL flex-row: first child (logo) = right, last child (links) = left */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <a href="#" className="flex items-center gap-1">
            <span className="text-xl font-bold text-white">Nadav</span>
            <span className="text-xl font-bold text-cyan-400">AI</span>
          </a>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Nadav AI. כל הזכויות שמורות.
          </p>

          {/* Social & Email Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* ⚠️  Update this LinkedIn URL to your actual profile */}
            <a
              href="https://www.linkedin.com/in/nadav"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href="mailto:nadavshtibel@gmail.com"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              dir="ltr"
            >
              nadavshtibel@gmail.com
            </a>
            <Link
              href="/blog"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              בלוג
            </Link>
            <Link
              href="/accessibility"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              הצהרת נגישות
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}

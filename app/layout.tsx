import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'

// Load Assistant — a modern, clean Hebrew-optimized Google Font
const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

// TODO: Replace with your actual production domain
const SITE_URL = 'https://nadavai.co.il'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nadav AI – יועץ ומומחה בינה מלאכותית לעסקים',
    template: '%s | Nadav AI',
  },
  description:
    'הופכים בינה מלאכותית לרווח נקי בעסק שלך. פתרונות AI מוכנים לייצור – סוכן ידע ארגוני, צ׳אט-בוט חכם, ודוחות אוטומטיים.',
  keywords: [
    'בינה מלאכותית',
    'AI לעסקים',
    'ייעוץ AI',
    'אוטומציה עסקית',
    'RAG',
    'צ\'אט-בוט',
    'Nadav AI',
    'פתרונות AI ישראל',
  ],
  authors: [{ name: 'Nadav Shtibel', url: SITE_URL }],
  creator: 'Nadav Shtibel',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: 'Nadav AI',
    title: 'Nadav AI – יועץ ומומחה בינה מלאכותית לעסקים',
    description:
      'הופכים בינה מלאכותית לרווח נקי בעסק שלך. פתרונות AI מוכנים לייצור – סוכן ידע ארגוני, צ׳אט-בוט חכם, ודוחות אוטומטיים.',
    // TODO: Add an OG image at public/og-image.png (1200×630 px)
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nadav AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nadav AI – יועץ ומומחה בינה מלאכותית לעסקים',
    description:
      'הופכים בינה מלאכותית לרווח נקי בעסק שלך. פתרונות AI מוכנים לייצור – סוכן ידע ארגוני, צ׳אט-בוט חכם, ודוחות אוטומטיים.',
    images: ['/og-image.png'],
  },
  verification: {
    // TODO: Add your Google Search Console verification token
    // google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // lang="he" for Hebrew, dir="rtl" for Right-to-Left layout
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body className="font-assistant bg-white text-gray-900">{children}</body>
    </html>
  )
}

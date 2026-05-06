import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AccessibilityMenu from '@/components/ui/AccessibilityMenu'

// Load Assistant — a modern, clean Hebrew-optimized Google Font
const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

const SITE_URL = 'https://nadav-shtibel.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  other: {
    'facebook-domain-verification': '47nhlp5d742cj9hr9we3zjouu6xstw',
  },
  title: {
    default: 'Nadav AI: בוטים ומערכות AI לעסקים ישראליים – דמואים חיים',
    template: '%s | Nadav AI',
  },
  description:
    'בניית בוטים ומערכות AI שמגדילים מכירות וחוסכים 40% זמן לעסקים ישראליים. דמואים חיים – סוכן ידע ארגוני, צ׳אט-בוט, WhatsApp וניתוח פיננסי.',
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
    title: 'Nadav AI: בוטים ומערכות AI לעסקים ישראליים – דמואים חיים',
    description:
      'בניית בוטים ומערכות AI שמגדילים מכירות וחוסכים 40% זמן לעסקים ישראליים. דמואים חיים – סוכן ידע ארגוני, צ׳אט-בוט, WhatsApp וניתוח פיננסי.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Nadav AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nadav AI – יועץ ומומחה בינה מלאכותית לעסקים',
    description:
      'הופך בינה מלאכותית לכוח עבודה בעסק שלך. פתרונות AI מוכנים לייצור – סוכן ידע ארגוני, צ׳אט-בוט חכם, ודוחות אוטומטיים.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-icon.svg',
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
      <body className="font-assistant bg-white text-gray-900">
        {/* Skip to main content – required for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[99999] focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
        >
          דלג לתוכן הראשי
        </a>
        {children}
        <AccessibilityMenu />
      </body>
      <Script
        id="voiceflow-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: '69f7cefbd8bf4ff14739ce53' },
                  url: 'https://general-runtime.voiceflow.com',
                  versionID: 'production',
                  voice: { url: 'https://runtime-api.voiceflow.com' },
                  launch: {
                    event: {
                      type: 'launch',
                      payload: { channel: 'website' }
                    }
                  }
                });
              }
              v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
              v.type = 'text/javascript';
              s.parentNode.insertBefore(v, s);
            })(document, 'script');
          `,
        }}
      />
    </html>
  )
}

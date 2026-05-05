import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description: 'הצהרת נגישות של אתר Nadav AI בהתאם לתקן הישראלי 5568 ותקנות שוויון זכויות לאנשים עם מוגבלות.',
  robots: { index: true, follow: true },
}

export default function AccessibilityPage() {
  return (
    <main
      id="main-content"
      dir="rtl"
      lang="he"
      className="min-h-screen bg-[#0A1628] text-gray-200 px-4 py-16"
    >
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-10 text-sm underline"
        >
          ← חזרה לדף הבית
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          הצהרת נגישות
        </h1>
        <p className="text-gray-400 text-sm mb-10">
          עודכן לאחרונה: מאי 2025
        </p>

        {/* ── Section 1 ── */}
        <section className="mb-10" aria-labelledby="s1">
          <h2 id="s1" className="text-xl font-semibold text-cyan-400 mb-3">
            כללי
          </h2>
          <p className="leading-relaxed text-gray-300">
            אתר <strong className="text-white">Nadav AI</strong>{' '}
            (<span dir="ltr">nadav-shtibel.com</span>) מחויב לנגישות
            דיגיטלית ולאפשר לכל אדם, לרבות אנשים עם מוגבלות, לגלוש באתר
            ולהשתמש בשירותיו בצורה שוויונית ומיטבית.
          </p>
          <p className="leading-relaxed text-gray-300 mt-3">
            ביצענו התאמות נגישות בהתאם לתקן הישראלי{' '}
            <strong className="text-white">5568</strong> ולהנחיות WCAG 2.1
            ברמה <strong className="text-white">AA</strong>, מכוח תקנה 35
            לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
            התשע"ג–2013.
          </p>
        </section>

        {/* ── Section 2 ── */}
        <section className="mb-10" aria-labelledby="s2">
          <h2 id="s2" className="text-xl font-semibold text-cyan-400 mb-3">
            רמת הנגישות של האתר
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed">
            <li>האתר בנוי ב-HTML סמנטי עם תגים מתאימים (<code>main</code>, <code>nav</code>, <code>section</code>, <code>footer</code> וכו׳).</li>
            <li>האתר תומך בניווט מלא באמצעות מקלדת בלבד (Tab, Shift+Tab, Enter, Space).</li>
            <li>מוגדר ניגודיות צבעים בהתאם לדרישות WCAG AA.</li>
            <li>כל התמונות מלוות בטקסט חלופי (<code>alt</code>).</li>
            <li>שפת האתר מוגדרת כעברית (<code>lang=&quot;he&quot;</code>) וכיוון טקסט מוגדר RTL.</li>
            <li>האתר כולל תפריט נגישות המאפשר: הגדלת טקסט, ניגודיות גבוהה, גוני אפור, הדגשת קישורים, פונט קריא ועצירת אנימציות.</li>
            <li>קיים קישור "דלג לתוכן" בראש כל עמוד לניווט מהיר.</li>
            <li>האתר נבדק בדפדפנים: Chrome, Firefox, Edge בגרסאות עדכניות.</li>
          </ul>
        </section>

        {/* ── Section 3 ── */}
        <section className="mb-10" aria-labelledby="s3">
          <h2 id="s3" className="text-xl font-semibold text-cyan-400 mb-3">
            מגבלות ידועות
          </h2>
          <p className="leading-relaxed text-gray-300">
            אנו עושים מאמץ לשמור על נגישות מלאה. עם זאת, ייתכן שחלק
            מהתכנים של צדדים שלישיים (כגון הצ׳אט-בוט החיצוני) אינם
            עומדים בכל דרישות התקן. אנו פועלים לשיפור מתמיד.
          </p>
        </section>

        {/* ── Section 4 – Contact ── */}
        <section
          className="mb-10 bg-blue-950/40 border border-blue-900/50 rounded-2xl p-6"
          aria-labelledby="s4"
        >
          <h2 id="s4" className="text-xl font-semibold text-cyan-400 mb-4">
            פניות בנושא נגישות
          </h2>
          <p className="leading-relaxed text-gray-300 mb-4">
            נתקלתם בתוכן שאינו נגיש, או שיש לכם הצעה לשיפור? נשמח לשמוע.
            ניתן לפנות אלינו בכל אחת מהדרכים הבאות:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>
              <span className="text-white font-medium">שם רכז הנגישות: </span>
              נדב שטיבל
            </li>
            <li>
              <span className="text-white font-medium">דוא&quot;ל: </span>
              <a
                href="mailto:nadavshtibel@gmail.com"
                dir="ltr"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                nadavshtibel@gmail.com
              </a>
            </li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            אנו נשתדל לחזור אליכם תוך 7 ימי עסקים.
          </p>
        </section>

        {/* ── Section 5 ── */}
        <section aria-labelledby="s5">
          <h2 id="s5" className="text-xl font-semibold text-cyan-400 mb-3">
            בסיס חוקי
          </h2>
          <p className="leading-relaxed text-gray-300">
            הצהרה זו נכתבה בהתאם לתקנה 35 לתקנות שוויון זכויות לאנשים עם
            מוגבלות (התאמות נגישות לשירות), התשע&quot;ג–2013, ולתקן
            הישראלי IS 5568.
          </p>
        </section>

      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

const SITE_URL = 'https://nadav-shtibel.com'

export const metadata: Metadata = {
  title: 'בלוג – תובנות AI ואסטרטגיות עסקיות',
  description:
    'תובנות מומחה על אוטומציה מבוססת AI, טרנספורמציה עסקית ואסטרטגיות מעשיות ליישום בינה מלאכותית בארגון שלך.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'בלוג – תובנות AI ואסטרטגיות עסקיות',
    description:
      'תובנות מומחה על אוטומציה מבוססת AI, טרנספורמציה עסקית ואסטרטגיות מעשיות ליישום בינה מלאכותית.',
    type: 'website',
    url: `${SITE_URL}/blog`,
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
        {/* Back to home */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-indigo-400 text-sm font-medium hover:underline"
          >
            → חזרה לדף הראשי
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">בלוג</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            תובנות מומחה על אוטומציה מבוססת AI, טרנספורמציה עסקית ואסטרטגיות יישום מעשיות
            לארגונים מודרניים.
          </p>
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-20">אין פוסטים עדיין. חזור בקרוב.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group outline-none">
                <article className="flex flex-col h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-indigo-500 group-focus-visible:border-indigo-500 transition-colors duration-300">
                  {/* Cover image (optional) */}
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden bg-gray-800">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-6">
                    {/* Date */}
                    <time
                      dateTime={post.date}
                      className="text-indigo-400 text-sm font-medium"
                    >
                      {formatDate(post.date)}
                    </time>

                    {/* Title */}
                    <h2 className="mt-2 text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-3 text-gray-400 text-sm line-clamp-3 flex-1">
                      {post.description}
                    </p>

                    {/* Keywords */}
                    {post.keywords && post.keywords.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.keywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="text-xs bg-gray-800 text-indigo-300 px-2.5 py-1 rounded-full"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <span className="mt-5 inline-block text-indigo-400 text-sm font-semibold group-hover:underline">
                      קרא עוד ←
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

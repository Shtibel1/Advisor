import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllSlugs, getPostBySlug, type Post } from '@/lib/mdx'

const SITE_URL = 'https://nadav-shtibel.com'

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${post.slug}`
  const ogImage = post.coverImage ? `${SITE_URL}${post.coverImage}` : `${SITE_URL}/opengraph-image`

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: post.author ? [post.author] : ['Nadav Shtibel'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

// ─── JSON-LD structured data ──────────────────────────────────────────────────

function BlogPostingJsonLd({ post }: { post: Post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'he',
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: post.author ?? 'Nadav Shtibel',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nadav AI',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    ...(post.coverImage && {
      image: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${post.coverImage}`,
      },
    }),
    ...(post.keywords?.length && { keywords: post.keywords.join(', ') }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  return (
    <>
      <BlogPostingJsonLd post={post} />

      <main className="min-h-screen bg-gray-950 text-white" dir="rtl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-indigo-400 text-sm font-medium hover:underline mb-10"
          >
            → חזרה לבלוג
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden aspect-video bg-gray-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post header */}
          <header className="mb-10 border-b border-gray-800 pb-8">
            <time dateTime={post.date} className="text-indigo-400 text-sm font-medium">
              {formatDate(post.date)}
            </time>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">{post.description}</p>

            {/* Keywords / tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-gray-800 text-indigo-300 px-3 py-1 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            {post.author && (
              <p className="mt-4 text-sm text-gray-500">
                מאת <span className="text-gray-300 font-medium">{post.author}</span>
              </p>
            )}
          </header>

          {/* Rendered markdown content — styled via @tailwindcss/typography */}
          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-indigo-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400 prose-th:text-white prose-td:text-gray-300">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 mb-4">מצאת את זה שימושי? שתף אותו, או צור איתנו קשר.</p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

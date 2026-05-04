import { NextRequest, NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'

export const dynamic = 'force-dynamic'

// Allowed actions to prevent misuse
const ALLOWED_ACTIONS = ['scrape', 'search'] as const
type Action = (typeof ALLOWED_ACTIONS)[number]

function getClient(): FirecrawlApp {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY not configured')
  return new FirecrawlApp({ apiKey: key })
}

export async function POST(req: NextRequest) {
  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({ error: 'FIRECRAWL_API_KEY not configured' }, { status: 503 })
  }

  let body: { action: Action; url?: string; query?: string; limit?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action, url, query, limit = 5 } = body

  if (!ALLOWED_ACTIONS.includes(action)) {
    return NextResponse.json({ error: 'Invalid action. Use "scrape" or "search".' }, { status: 400 })
  }

  const app = getClient()

  try {
    if (action === 'scrape') {
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ error: '"url" is required for scrape' }, { status: 400 })
      }

      // Basic URL validation – must be an absolute HTTP/HTTPS URL
      let parsed: URL
      try {
        parsed = new URL(url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'Only http/https URLs are allowed' }, { status: 400 })
      }

      const result = await app.scrapeUrl(url, { formats: ['markdown'] })

      if (!result.success) {
        return NextResponse.json({ error: 'Scrape failed' }, { status: 502 })
      }

      return NextResponse.json({ markdown: result.markdown, metadata: result.metadata })
    }

    if (action === 'search') {
      if (!query || typeof query !== 'string') {
        return NextResponse.json({ error: '"query" is required for search' }, { status: 400 })
      }

      const safeLimit = Math.min(Math.max(1, Number(limit)), 10)
      const result = await app.search(query, { limit: safeLimit })

      if (!result.success) {
        return NextResponse.json({ error: 'Search failed' }, { status: 502 })
      }

      return NextResponse.json({ results: result.data })
    }
  } catch (err) {
    console.error('[Firecrawl] error:', err)
    return NextResponse.json({ error: 'Firecrawl request failed' }, { status: 500 })
  }
}

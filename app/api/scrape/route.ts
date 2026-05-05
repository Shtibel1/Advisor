// No external scraping API needed — uses native fetch + HTML stripping
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Remove HTML tags and collapse whitespace into readable plain text. */
function htmlToText(html: string): string {
  return html
    // Remove <script> and <style> blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Replace block-level tags with newlines to preserve structure
    .replace(/<\/?(p|div|section|article|header|footer|h[1-6]|li|tr|br)[^>]*>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse repeated blank lines / spaces
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function POST(req: NextRequest) {
  let body: { url: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { url } = body

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: '"url" is required' }, { status: 400 })
  }

  // Validate absolute HTTP/HTTPS URL to prevent SSRF
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'Only http/https URLs are allowed' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Agent-Demo/1.0)',
        Accept: 'text/html',
      },
      // Abort after 15 s to avoid hanging the serverless function
      signal: AbortSignal.timeout(15_000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL — HTTP ${response.status}` },
        { status: 502 },
      )
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'URL did not return an HTML page' },
        { status: 422 },
      )
    }

    const html = await response.text()
    const markdown = htmlToText(html)

    if (!markdown) {
      return NextResponse.json({ error: 'No readable content found on page' }, { status: 502 })
    }

    // Cap at ~40k chars to stay within AI context limits
    return NextResponse.json({ markdown: markdown.slice(0, 40_000) })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Scrape failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}


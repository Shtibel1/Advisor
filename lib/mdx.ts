import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  slug: string
  keywords: string[]
  coverImage?: string
  author?: string
}

export interface Post extends PostFrontmatter {
  content: string
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

/** Returns all post frontmatter, sorted newest first. */
export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return data as PostFrontmatter
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Returns all slugs (filename without extension) for static param generation. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

/** Returns a single post (frontmatter + raw markdown content) by slug, or null if not found. */
export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null

  const files = fs.readdirSync(POSTS_DIR)
  const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return null

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
  const { data, content } = matter(raw)

  return {
    ...(data as PostFrontmatter),
    content,
  }
}

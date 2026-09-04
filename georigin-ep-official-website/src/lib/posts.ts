/**
 * Build-note posts, loaded at build time from src/content/posts/*.md.
 *
 * Convention (same as the old static site): the file name is the publish
 * date (`YYYY-MM-DD.md`) and doubles as the URL slug; the first `# ` line
 * is the title. To publish a new note, just drop a markdown file in
 * src/content/posts/ — no other edits needed.
 */

export interface Post {
  /** File name without extension, e.g. "2026-06-07". Also the URL slug. */
  slug: string
  /** Publish date, taken from the file name. */
  date: string
  title: string
  excerpt: string
  /** Raw markdown body with the leading `# title` line removed. */
  content: string
}

const rawPosts = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const MAX_EXCERPT = 160

function stripMd(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .trim()
}

function parsePost(filename: string, raw: string): Post {
  const slug = filename.replace(/\.md$/, '')
  const lines = raw.split('\n')
  const titleIndex = lines.findIndex((l) => l.trimStart().startsWith('# '))
  const title = titleIndex >= 0 ? stripMd(lines[titleIndex]) : slug
  const content =
    titleIndex >= 0
      ? lines
          .filter((_, i) => i !== titleIndex)
          .join('\n')
          .trim()
      : raw.trim()

  // Excerpt: first plain-text line, skipping headings, images, horizontal
  // rules, raw HTML blocks and standalone date stamps like "**2026.01.02**".
  let excerpt = ''
  for (const line of lines.slice(titleIndex + 1)) {
    const t = line.trim()
    if (!t || t.startsWith('#') || t.startsWith('!') || t.startsWith('<') || t === '---') continue
    const plain = stripMd(t)
    if (!plain || /^\d{4}[./-]\d{2}[./-]\d{2}$/.test(plain)) continue
    excerpt = plain
    break
  }
  if (excerpt.length > MAX_EXCERPT) {
    excerpt = excerpt.slice(0, MAX_EXCERPT).replace(/\s+\S*$/, '') + '…'
  }

  return { slug, date: slug, title, excerpt, content }
}

/** All posts, newest first. */
export const POSTS: Post[] = Object.entries(rawPosts)
  .map(([path, raw]) => parsePost(path.split('/').pop() ?? '', raw))
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string | undefined): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}

import { useState, useEffect } from 'react'
import { createHighlighter, type Highlighter } from 'shiki'

const LANGS = [
  'javascript', 'typescript', 'jsx', 'tsx',
  'python', 'bash', 'sh', 'json', 'html', 'css',
  'markdown', 'yaml', 'toml', 'rust', 'go', 'java',
  'c', 'cpp', 'sql', 'php', 'ruby', 'diff', 'text',
] as const

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [...LANGS],
    })
  }
  return highlighterPromise
}

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((hl) => {
      if (cancelled) return
      let result: string
      try {
        result = hl.codeToHtml(code, { lang: lang || 'text', theme: 'github-dark' })
      } catch {
        result = hl.codeToHtml(code, { lang: 'text', theme: 'github-dark' })
      }
      setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code, lang])

  if (!html) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 border border-zinc-700 p-4 text-sm font-mono text-zinc-300">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className="my-4 rounded-lg border border-zinc-700 overflow-hidden text-sm [&>pre]:m-0! [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:rounded-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

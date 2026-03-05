import type { Components } from 'react-markdown'
import { CodeBlock } from './code-block'

export const customComponents: Partial<Components> = {
  // Headings
  h1: ({ children }) => (
    <h1 className="my-6 text-3xl font-bold text-zinc-100 border-b border-zinc-700 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="my-5 text-2xl font-bold text-zinc-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="my-4 text-xl font-semibold text-zinc-200">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="my-3 text-lg font-semibold text-zinc-300">{children}</h4>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="my-3 leading-7 text-zinc-300">{children}</p>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-blue-500 bg-zinc-800/50 pl-4 pr-3 py-2 rounded-r-md italic text-zinc-400">
      {children}
    </blockquote>
  ),

  // Lists
  ul: ({ children }) => <ul className="my-3 ml-2 space-y-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-3 ml-4 list-decimal space-y-1 text-zinc-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2 text-zinc-300">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
      <span>{children}</span>
    </li>
  ),

  // Code
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      const lang = className?.replace('language-', '') ?? 'text'
      const code = String(children).replace(/\n$/, '')
      return <CodeBlock code={code} lang={lang} />
    }
    return (
      <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-sm font-mono text-emerald-400">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,

  // Table
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-700">
      <table className="w-full text-sm text-zinc-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-800 text-zinc-100 text-left">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 font-semibold border-b border-zinc-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-b border-zinc-800">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-zinc-800/50 transition-colors">{children}</tr>
  ),

  // Divider
  hr: () => <hr className="my-6 border-zinc-700" />,

  // Bold & Italic
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-400">{children}</em>,
}

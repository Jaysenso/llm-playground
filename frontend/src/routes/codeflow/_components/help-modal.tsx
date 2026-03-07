import { X, AlertTriangle, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HelpModal({
  onClose,
  onCopyPrompt,
  copied,
}: {
  onClose: () => void
  onCopyPrompt: () => void
  copied: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-(--chat-input-bg) border border-(--chat-border) rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--chat-border)">
          <div>
            <h2 className="font-semibold text-base text-(--chat-text)">
              Codeflow
            </h2>
            <p className="text-xs text-(--chat-muted) mt-0.5">
              Visualize your codebase as a call graph
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-(--chat-muted) hover:text-(--chat-text) transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[70vh] text-sm">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              What is this?
            </h3>
            <p className="text-(--chat-text) leading-relaxed text-[13px]">
              <span className="text-sm text-(--chat-accent) font-semibold">
                Codeflow
              </span>{' '}
              turns your code into an interactive call graph — built for vibe
              coders who want to understand their AI-generated codebase at a
              glance.
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              Workflow
            </h3>
            <div className="space-y-2">
              {[
                ['1', 'Copy the generation prompt below'],
                [
                  '2',
                  'Paste it into Claude Code, Cursor, Windsurf, or any AI agent in your IDE',
                ],
                [
                  '3',
                  'The agent analyzes your codebase and writes codeflow.json',
                ],
                ['4', 'Drop that file here to explore your architecture'],
              ].map(([num, step]) => (
                <div key={num} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-(--chat-accent)/20 text-(--chat-accent) text-[9px] font-bold shrink-0 mt-0.5">
                    {num}
                  </span>
                  <span className="text-(--chat-muted) text-[12px] leading-relaxed">
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={onCopyPrompt}
              className={cn(
                'mt-3 w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg border transition-all',
                copied
                  ? 'bg-green-500/10 border-green-500/30 text-white'
                  : 'border-(--chat-border) text-(--chat-muted) hover:text-(--chat-text) hover:border-(--chat-muted)',
              )}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy prompt to clipboard'}
            </button>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              JSON format
            </h3>
            <pre className="bg-(--chat-bg) border border-(--chat-border) rounded-lg px-4 py-3 text-[11px] text-(--chat-text) overflow-x-auto leading-relaxed">{`{
  "nodes": [
    { "id": "1", "label": "main", "file": "src/main.ts",
      "type": "entry", "description": "..." }
  ],
  "edges": [
    { "from": "1", "to": "2", "label": "calls" }
  ]
}`}</pre>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              Interactions
            </h3>
            <div className="space-y-2">
              {[
                [
                  'Click node',
                  'Select and highlight its call tree (successors)',
                ],
                [
                  'Ctrl / ⌘ + click',
                  'Show full relationship tree — predecessors and successors',
                ],
                ['Click background', 'Deselect and restore all nodes'],
                ['Click sidebar node', 'Jump to and focus that node'],
                ['Scroll', 'Zoom in / out'],
                ['Drag', 'Pan the canvas'],
              ].map(([key, desc]) => (
                <div key={key} className="flex gap-3">
                  <span className="shrink-0 text-[11px] font-medium bg-(--chat-bg) border border-(--chat-border) rounded px-1.5 py-0.5 text-(--chat-text) whitespace-nowrap">
                    {key}
                  </span>
                  <span className="text-(--chat-muted) text-[12px] leading-relaxed">
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              Toolbar
            </h3>
            <div className="space-y-2">
              {[
                ['Fit', 'Zoom to fit all visible nodes in view'],
                ['Focus', 'Always show predecessors + successors on click'],
                [
                  'Light',
                  'White background — useful for screenshots or exports',
                ],
                [
                  'Reset',
                  'Reset the graph layout to its initial positions and restore all filters',
                ],
                [
                  'New file',
                  'Go back to the upload screen to load a different JSON file',
                ],
              ].map(([key, desc]) => (
                <div key={key} className="flex gap-3">
                  <span className="shrink-0 text-[11px] font-medium bg-(--chat-bg) border border-(--chat-border) rounded px-1.5 py-0.5 text-(--chat-text) whitespace-nowrap">
                    {key}
                  </span>
                  <span className="text-(--chat-muted) text-[12px] leading-relaxed">
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
              Dead nodes
            </h3>
            <p className="text-(--chat-muted) text-[12px] leading-relaxed flex items-start gap-2">
              <AlertTriangle
                size={13}
                className="text-amber-400 shrink-0 mt-0.5"
              />
              Nodes with no incoming edges (nothing calls them) are flagged as
              dead code. They appear with a warning icon in the sidebar.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

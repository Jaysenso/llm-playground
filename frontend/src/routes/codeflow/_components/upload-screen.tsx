import { Upload, Terminal, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CODEGEN_PROMPT } from '../_lib/constants'

export function UploadScreen({
  isDragging,
  copied,
  pasteJson,
  onLoadDemo,
  onCopyPrompt,
  onFileChange,
  onPasteChange,
  onVisualize,
}: {
  isDragging: boolean
  copied: boolean
  pasteJson: string
  onLoadDemo: () => void
  onCopyPrompt: () => void
  onFileChange: (file: File) => void
  onPasteChange: (v: string) => void
  onVisualize: () => void
}) {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-(--chat-bg) z-10">
      <div className="flex flex-col items-center gap-5 py-10 min-h-full justify-center">
        {/* Hero */}
        <div className="text-center max-w-sm">
          <h1 className="text-lg font-semibold text-(--chat-text) mb-1">
            Visualize your codebase
          </h1>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-(--chat-muted) mb-2">
            What is this?
          </h3>
          <p className="text-(--chat-text) leading-relaxed text-[13px]">
            Codeflow is built for{' '}
            <span className="text-(--chat-accent) font-medium">
              vibe coders
            </span>{' '}
            — developers who use AI agents to write their code. As AI generates
            more of your codebase, understanding what was built becomes the
            bottleneck. Codeflow solves this by visualizing your project as an
            interactive call graph: trace execution paths, map dependencies, and
            spot dead code instantly.
          </p>
        </div>

        <button
          onClick={onLoadDemo}
          className="text-(--chat-muted) text-xs border border-(--chat-border) rounded-lg px-3 py-1.5 hover:text-(--chat-text) hover:border-(--chat-muted) transition-colors"
        >
          ✦ Load demo project
        </button>

        {/* Step 1 — generate */}
        <div className="w-full max-w-md border border-(--chat-border) rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-(--chat-input-bg) border-b border-(--chat-border)">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--chat-accent) text-white text-[10px] font-bold shrink-0">
              1
            </span>
            <span className="text-sm font-medium text-(--chat-text)">
              Generate your codeflow.json
            </span>
          </div>
          <div className="px-4 py-3 bg-(--chat-bg) space-y-3">
            <p className="text-xs text-(--chat-muted) leading-relaxed">
              Paste the prompt below into{' '}
              <span className="text-(--chat-text) font-medium">
                Claude Code
              </span>
              , Cursor, Windsurf, or any AI coding agent in your IDE. Run it on
              your project root to generate the file.
            </p>
            <div className="relative">
              <pre className="bg-(--chat-input-bg) border border-(--chat-border) rounded-lg px-3 py-2.5 text-[10px] text-(--chat-muted) font-mono leading-relaxed overflow-hidden max-h-20 select-none">
                {CODEGEN_PROMPT.slice(0, 180)}…
              </pre>
              <button
                onClick={onCopyPrompt}
                className={cn(
                  'absolute top-2 right-2 flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md border transition-all',
                  copied
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-(--chat-bg) border-(--chat-border) text-(--chat-muted) hover:text-(--chat-text) hover:border-(--chat-muted)',
                )}
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied!' : 'Copy prompt'}
              </button>
            </div>
            <p className="text-[10px] text-(--chat-muted) flex items-center gap-1.5">
              <Terminal size={10} className="shrink-0" />
              Works with Claude Code, Cursor, Windsurf, Copilot, and any agent
              with file-write access
            </p>
          </div>
        </div>

        {/* Step 2 — upload */}
        <div className="w-full max-w-md border border-(--chat-border) rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-(--chat-input-bg) border-b border-(--chat-border)">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-(--chat-accent) text-white text-[10px] font-bold shrink-0">
              2
            </span>
            <span className="text-sm font-medium text-(--chat-text)">
              Drop or paste your file
            </span>
          </div>
          <div className="px-4 py-4 bg-(--chat-bg) flex flex-col gap-3">
            <label
              className={cn(
                'flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all',
                isDragging
                  ? 'border-(--chat-accent) bg-(--chat-accent)/5'
                  : 'border-(--chat-border) hover:border-(--chat-accent)/50',
              )}
            >
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onFileChange(f)
                }}
              />
              <Upload
                size={20}
                className="text-(--chat-muted) mb-2 opacity-60"
              />
              <p className="text-(--chat-text) text-sm font-medium">
                Drop codeflow.json here
              </p>
              <p className="text-(--chat-muted) text-xs mt-0.5">
                or click to browse
              </p>
            </label>

            <div className="flex items-center gap-2 text-[10px] text-(--chat-muted)">
              <div className="flex-1 h-px bg-(--chat-border)" />
              or paste JSON
              <div className="flex-1 h-px bg-(--chat-border)" />
            </div>

            <textarea
              value={pasteJson}
              onChange={(e) => onPasteChange(e.target.value)}
              placeholder='{ "nodes": [...], "edges": [...] }'
              className="w-full h-20 bg-(--chat-input-bg) border border-(--chat-border) rounded-lg px-3 py-2 text-xs font-mono text-(--chat-text) placeholder:text-(--chat-muted) outline-none focus:border-(--chat-accent) resize-none transition-colors"
            />
            <Button
              className="w-full text-sm"
              onClick={onVisualize}
              disabled={!pasteJson}
            >
              Visualize
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

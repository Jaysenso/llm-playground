import { Markdown } from '@/components/ui/markdown'
import { customComponents } from './markdown-style'
import { Bot } from 'lucide-react'

/* ── Typing indicator ───────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.25 py-6 pt-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block size-1.5 rounded-full bg-(--chat-muted) animate-[dotPulse_1.4s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  )
}

/* ── Single message ─────────────────────────────────────── */
export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end mb-7 animate-[msgIn_0.2s_ease-out]">
      <div className="max-w-[72%] bg-(--chat-user-bubble) text-(--chat-user-text) font-body text-sm leading-[1.65] px-4.5 py-2.75 rounded-[22px] whitespace-pre-wrap wrap-break-word">
        {content}
      </div>
    </div>
  )
}

export function AssistantMessage({
  modelName,
  content,
  isStreaming,
}: {
  modelName: string
  content: string
  isStreaming?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 mb-7 animate-[msgIn_0.2s_ease-out]">
      {/* Avatar + Model name */}
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-(--chat-accent) flex items-center justify-center shrink-0">
          <Bot className="size-4 text-white" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {modelName ? modelName : 'Unknown Model'}
        </span>
      </div>

      {/* Message content */}
      <div className="font-body text-sm leading-7 text-(--chat-text) wrap-break-word">
        {!content && isStreaming ? (
          <TypingDots />
        ) : (
          <Markdown
            components={customComponents}
            className={`prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs dark:prose-invert${isStreaming ? ' streaming-cursor' : ''}`}
          >
            {content}
          </Markdown>
        )}
      </div>
    </div>
  )
}

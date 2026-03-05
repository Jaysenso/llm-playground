import { Markdown } from '@/components/ui/markdown'
import { customComponents } from './markdown-style'

/* ── Typing indicator ───────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.25 py-1">
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
  content,
  isStreaming,
}: {
  content: string
  isStreaming?: boolean
}) {
  return (
    <div className="flex gap-3 mb-7 animate-[msgIn_0.2s_ease-out]">
      {/* Avatar */}
      <div className="shrink-0 mt-0.2">
        <div className="size-6 rounded-lg bg-(--chat-accent) flex items-center justify-center" />
      </div>

      {/* Text */}
      <div className="flex-1 font-body text-sm leading-7 text-(--chat-text) pt-0.5 wrap-break-word">
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

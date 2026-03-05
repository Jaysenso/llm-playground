const SUGGESTIONS = [
  {
    label: 'Explain something complex',
    prompt: "Explain quantum entanglement like I'm 12",
  },
  {
    label: 'Write me code',
    prompt: 'Write a TypeScript debounce function with generics',
  },
  {
    label: 'Brainstorm ideas',
    prompt: 'Give me 5 unique project ideas for a weekend build',
  },
  {
    label: 'Improve my writing',
    prompt: 'Help me make this more compelling: ',
  },
]

/* ── Welcome screen ─────────────────────────────────────── */
export function WelcomeScreen({
  onSuggestion,
}: {
  onSuggestion: (p: string) => void
}) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 pb-12 animate-[welcomeIn_0.4s_ease-out]">
      <h1 className="font-display italic font-semibold text-[32px] text-amber-400 tracking-[-0.02em] mb-2">
        {greeting}.
      </h1>
      <p className="font-body text-[15px] font-normal text-(--chat-muted) mb-9">
        How can I help you today?
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-110">
        {SUGGESTIONS.map((s) => (
          <SuggestionChip
            key={s.label}
            label={s.label}
            onClick={() => onSuggestion(s.prompt)}
          />
        ))}
      </div>
    </div>
  )
}

function SuggestionChip({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="font-normal text-left px-4 py-3 rounded-2xl border border-(--chat-border) bg-(--chat-input-bg) text-(--chat-muted) font-body text-[13px] cursor-pointer transition-all duration-150 hover:bg-(--chat-surface) hover:text-(--chat-text) hover:border-(--chat-muted) hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
    >
      {label}
    </button>
  )
}

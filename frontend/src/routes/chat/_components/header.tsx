import { Link } from '@tanstack/react-router'
import { SquarePen, GitFork } from 'lucide-react'

/* ── Header new-chat button ─────────────────────────────── */
function NewChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border-none bg-transparent text-(--chat-muted) font-body text-[13px] cursor-pointer transition-all duration-150 hover:bg-(--chat-surface) hover:text-(--chat-text)"
    >
      <SquarePen size={14} />
      New chat
    </button>
  )
}

export function Header({ handleNewChat }: { handleNewChat: () => void }) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-(--chat-border) shrink-0 bg-(--chat-bg)">
      <span className="font-semibold">Blank</span>

      <nav className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        {(['Home', 'Explore'] as const).map((label) => (
          <a
            key={label}
            href="#"
            className="px-7 py-1.5 rounded-[10px] font-body font-semibold text-[13px] transition-all duration-150 hover:bg-(--chat-surface) hover:text-(--chat-text)"
          >
            {label}
          </a>
        ))}
        <Link
          to="/codeflow"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] font-body font-semibold text-[13px] transition-all duration-150 hover:bg-(--chat-surface) hover:text-(--chat-text) [&.active]:bg-(--chat-surface) [&.active]:text-(--chat-text)"
        >
          <GitFork size={13} />
          Codeflow
        </Link>
      </nav>

      <NewChatButton onClick={handleNewChat} />
    </header>
  )
}

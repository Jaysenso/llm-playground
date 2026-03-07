import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import type { Neighbor, SelectedNode } from '../_lib/types'
import { TYPE_LABELS } from '../_lib/types'
import { BADGE_COLORS } from '../_lib/constants'
import { AlertTriangle, X, FileCode2, FolderOpen } from 'lucide-react'

export function DetailSection({
  selected,
  typeColor,
  isDead,
  dir,
  clearDetail,
  goToNode,
}: {
  selected: SelectedNode
  typeColor: {
    bg: string
    border: string
    text: string
  }
  isDead: boolean
  dir: string
  clearDetail: () => void
  goToNode: (id: string) => void
}) {
  return (
    <div
      className="fixed right-4 top-16 w-72 max-h-[calc(100vh-5rem)] bg-(--chat-input-bg) border rounded-xl z-50 flex flex-col shadow-2xl overflow-hidden"
      style={{ borderColor: typeColor.border + '55' }}
    >
      {/* Accent line */}
      <div
        className="h-0.5 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${typeColor.border}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="p-4 shrink-0 border-b border-(--chat-border)">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border"
              style={{
                background: typeColor.bg,
                color: typeColor.text,
                borderColor: typeColor.border + '80',
              }}
            >
              {selected.type}
            </span>
            {isDead && (
              <span className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400">
                <AlertTriangle size={8} />
                dead
              </span>
            )}
          </div>
          <button
            onClick={clearDetail}
            className="text-(--chat-muted) hover:text-(--chat-text) shrink-0 transition-colors mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
        <h3 className="font-bold text-base leading-tight truncate text-(--chat-text)">
          {selected.label}
        </h3>
        {selected.file && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <FileCode2
              size={10}
              className="shrink-0"
              style={{ color: typeColor.border }}
            />
            <p
              className="text-[10px] font-mono truncate"
              style={{ color: typeColor.text }}
            >
              {selected.file}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col divide-y-2 divide-mist-200">
        {/* Description */}
        {selected.description && (
          <div
            className="px-4 py-3 border-l-2"
            style={{ borderLeftColor: typeColor.border }}
          >
            <p className="text-xs leading-relaxed text-(--chat-text) opacity-80">
              {selected.description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="px-4 py-2.5 flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ArrowUpRight size={11} className="text-violet-400" />
            <span className="font-mono font-semibold text-(--chat-text)">
              {selected.calls.length}
            </span>
            <span className="text-(--chat-text) opacity-50">calls</span>
          </span>
          <span className="w-px h-3 bg-(--chat-border)" />
          <span className="flex items-center gap-1.5">
            <ArrowDownLeft size={11} className="text-sky-400" />
            <span className="font-mono font-semibold text-(--chat-text)">
              {selected.calledBy.length}
            </span>
            <span className="text-(--chat-text) opacity-50">callers</span>
          </span>
          {dir && (
            <>
              <span className="w-px h-3 bg-(--chat-border)" />
              <span className="flex items-center gap-1 min-w-0">
                <FolderOpen size={9} className="shrink-0 text-(--chat-muted)" />
                <span className="text-[10px] truncate text-(--chat-text) opacity-60">
                  {dir}
                </span>
              </span>
            </>
          )}
        </div>

        {/* Relations */}
        <div className="px-3 py-3 space-y-4">
          <SubSection
            title="Calls"
            items={selected.calls}
            onNavigate={goToNode}
            direction="out"
          />
          <SubSection
            title="Called by"
            items={selected.calledBy}
            onNavigate={goToNode}
            direction="in"
          />
        </div>
      </div>
    </div>
  )
}

/* ── Detail section sub-component ──────────────────────── */
function SubSection({
  title,
  items,
  onNavigate,
  direction,
}: {
  title: string
  items: Neighbor[]
  onNavigate: (id: string) => void
  direction: 'out' | 'in'
}) {
  const Icon = direction === 'out' ? ArrowUpRight : ArrowDownLeft
  const iconClass = direction === 'out' ? 'text-violet-400' : 'text-sky-400'

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={10} className={iconClass} />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--chat-muted)">
          {title}
        </p>
        <span className="ml-auto font-mono text-[10px] text-(--chat-muted) opacity-50">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-(--chat-muted) opacity-30 pl-3.5 italic">
          none
        </p>
      ) : (
        <ul className="space-y-0.5">
          {items.map((n) => {
            const badge =
              BADGE_COLORS[n.type ?? 'function'] ?? BADGE_COLORS.function
            const typeLabel =
              (TYPE_LABELS as Record<string, string>)[n.type ?? 'function'] ??
              '?'
            return (
              <li key={n.id}>
                <button
                  onClick={() => onNavigate(n.id)}
                  className="w-full flex items-center gap-2 text-left text-xs hover:bg-(--chat-surface)/60 transition-colors group py-1 px-1.5 rounded-md"
                >
                  <span
                    className="text-[8px] font-bold w-9 text-center py-0.5 rounded shrink-0 leading-none"
                    style={{ background: badge.bg, color: badge.text }}
                  >
                    {typeLabel}
                  </span>
                  <span className="truncate text-(--chat-muted) group-hover:text-(--chat-text) transition-colors flex-1">
                    {n.label}
                  </span>
                  {n.edgeLabel && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-(--chat-surface) text-(--chat-muted) shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      {n.edgeLabel}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

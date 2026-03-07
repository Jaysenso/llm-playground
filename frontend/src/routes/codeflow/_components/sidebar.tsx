import {
  X,
  FolderOpen,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
  Info,
} from 'lucide-react'
import {
  DIRECTORY_PALETTE,
  BADGE_COLORS,
  TYPE_LABELS,
  TYPE_DESCRIPTIONS,
} from '../_lib/constants'
import type { NodeType, NodeDef, SelectedNode } from '../_lib/types'
import { cn } from 'lib/util'

export function Sidebar({
  search,
  selected,
  deadNodeIds,
  filteredNodes,
  deadCount,
  showDead,
  availableDirectories,
  activeDirectories,
  availableTypes,
  activeTypes,
  filterOpen,
  legendOpen,
  onToggleType,
  onSearchChange,
  onShowDead,
  onToggleDirectory,
  onSelectAllTypes,
  onClearTypes,
  onToggleFilter,
  onToggleLegend,
  onNodeSelection,
}: {
  search: string
  selected: SelectedNode | null
  deadNodeIds: Set<string>
  filteredNodes: NodeDef[]
  deadCount: number
  showDead: boolean
  availableDirectories: string[]
  activeDirectories: Set<string>
  availableTypes: string[]
  activeTypes: Set<string>
  filterOpen: boolean
  legendOpen: boolean
  onToggleType: (type: string) => void
  onSearchChange: (id: string) => void
  onShowDead: () => void
  onToggleDirectory: (dir: string) => void
  onSelectAllTypes: (availableTypes: Set<string | null>) => void
  onClearTypes: (availableTypes: Set<string | null>) => void
  onToggleFilter: () => void
  onToggleLegend: () => void
  onNodeSelection: (id: string) => void
}) {
  return (
    <aside className="w-60 bg-(--chat-input-bg) border-r border-(--chat-border) flex flex-col shrink-0">
      <div className="p-2.5">
        <div className="relative w-full">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            className="w-full bg-(--chat-bg) border border-(--chat-border) rounded-lg px-3 py-1.5 text-sm text-(--chat-text) placeholder:text-(--chat-muted) outline-none focus:border-(--chat-accent) transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-(--chat-muted) hover:text-(--chat-text) transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      {/* Directory filter */}
      {availableDirectories.length > 1 && (
        <div className="px-2.5 pb-2">
          <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-(--chat-muted) flex items-center gap-1.5">
            <FolderOpen size={10} />
            Directories
          </p>
          <div className="flex flex-wrap gap-1 px-1">
            {availableDirectories.map((dir, i) => {
              const color = DIRECTORY_PALETTE[i % DIRECTORY_PALETTE.length]
              const active = activeDirectories.has(dir)
              return (
                <button
                  key={dir}
                  onClick={() => onToggleDirectory(dir)}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all"
                  style={{
                    background: active ? color + '22' : 'transparent',
                    color: active ? color : 'var(--chat-muted)',
                    border: `1px solid ${active ? color + '66' : 'var(--chat-border)'}`,
                    opacity: active ? 1 : 0.45,
                  }}
                >
                  {dir}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Type filter dropdown */}
      {availableTypes.length > 0 && (
        <div className="px-2.5 pb-2">
          <button
            onClick={onToggleFilter}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-xs text-(--chat-muted) hover:text-(--chat-text) hover:bg-(--chat-surface)/50 transition-colors"
          >
            <SlidersHorizontal size={11} />
            <span className="font-medium">Filter</span>
            {activeTypes.size < availableTypes.length && (
              <span className="ml-1 text-[10px] px-1 rounded bg-(--chat-accent)/20 text-(--chat-accent)">
                {activeTypes.size}/{availableTypes.length}
              </span>
            )}
            <ChevronDown
              size={11}
              className={cn(
                'ml-auto transition-transform',
                filterOpen && 'rotate-180',
              )}
            />
          </button>
          {filterOpen && (
            <div>
              <div className="flex flex-row items-center gap-3 px-2 mt-2 text-[10px] ">
                <button
                  className={cn(
                    'font-medium border-2 rounded-2xl px-2 py-1 transition-colors hover:text-green-400',
                  )}
                  onClick={() => onSelectAllTypes(new Set(availableTypes))}
                >
                  Select All
                </button>
                <button
                  className="font-medium border-2 rounded-2xl px-2 py-1 transition-colors hover:text-red-400"
                  onClick={() => onClearTypes(new Set(null))}
                >
                  Clear All
                </button>
                <button
                  onClick={onToggleLegend}
                  className={cn(
                    'ml-auto pr-1 flex items-center gap-1 transition-colors',
                    legendOpen
                      ? 'text-(--chat-accent)'
                      : 'text-(--chat-muted) hover:text-(--chat-text)',
                  )}
                >
                  <Info size={11} />
                  <span>legend</span>
                </button>
              </div>
              {legendOpen && (
                <div className="mx-2 mt-2 mb-1 rounded-lg border border-(--chat-border) bg-(--chat-bg) p-2.5 flex flex-col gap-1.5">
                  {availableTypes.map((type) => {
                    const badge = BADGE_COLORS[type] ?? BADGE_COLORS.function
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-semibold w-10 text-center py-0.5 rounded shrink-0"
                          style={{
                            background: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {(TYPE_LABELS as Record<string, string>)[type] ??
                            type}
                        </span>
                        <span className="text-[10px] text-(--chat-muted)">
                          {TYPE_DESCRIPTIONS[type] ?? type}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1 px-1">
                {availableTypes.map((type) => {
                  const badge = BADGE_COLORS[type] ?? BADGE_COLORS.function
                  const active = activeTypes.has(type)
                  return (
                    <button
                      key={type}
                      onClick={() => onToggleType(type)}
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded transition-all"
                      style={{
                        background: active ? badge.bg : 'transparent',
                        color: active ? badge.text : 'var(--chat-muted)',
                        border: `1px solid ${active ? badge.text + '60' : 'var(--chat-border)'}`,
                        opacity: active ? 1 : 0.4,
                      }}
                    >
                      {TYPE_LABELS[type as NodeType] ?? type}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-2.5 pb-1.5 flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-(--chat-muted)">
          {filteredNodes.length} nodes
        </span>
        {deadCount > 0 && (
          <button
            onClick={onShowDead}
            className={cn(
              'ml-auto flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all',
              showDead
                ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                : 'border-(--chat-border) text-(--chat-muted) opacity-50',
            )}
          >
            <AlertTriangle size={9} />
            {deadCount} dead
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 pb-2">
        {filteredNodes.map((n) => {
          const badge =
            BADGE_COLORS[n.type ?? 'function'] ?? BADGE_COLORS.function
          return (
            <div
              key={n.id}
              onClick={() => onNodeSelection(n.id)}
              className={cn(
                'flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                selected?.id === String(n.id)
                  ? 'bg-(--chat-surface)'
                  : 'hover:bg-(--chat-surface)/50',
              )}
            >
              <span
                className="text-[10px] font-semibold w-10 text-center py-0.5 rounded shrink-0"
                style={{ background: badge.bg, color: badge.text }}
              >
                {(n.type && TYPE_LABELS[n.type]) ?? 'fn'}
              </span>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="truncate text-(--chat-text) text-xs font-medium">
                  {n.label ?? n.id}
                </div>
                <div className="truncate text-(--chat-muted) text-[10px]">
                  {n.file}
                </div>
              </div>
              {deadNodeIds.has(String(n.id)) && (
                <AlertTriangle
                  size={11}
                  className="shrink-0 text-amber-400 opacity-70"
                  aria-label="Dead node — nothing calls this"
                />
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

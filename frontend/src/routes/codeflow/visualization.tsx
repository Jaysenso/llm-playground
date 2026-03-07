import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { DetailSection } from './_components/detail-section'
import { Sidebar } from './_components/sidebar'
import { useCodeflowContext } from './_lib/context'

export const Route = createFileRoute('/codeflow/visualization')({
  component: CodeflowVisualization,
})

function CodeflowVisualization() {
  const navigate = useNavigate()
  const {
    state,
    initCy,
    clearDetail,
    goToNode,
    filteredNodes,
    availableTypes,
    toggleType,
    selectedTypeColor,
    selectedIsDead,
    selectedDir,
    readFile,
  } = useCodeflowContext()

  /* initialize cytoscape once the container div is mounted */
  useEffect(() => {
    const pending = state.pendingDataRef.current
    if (pending) {
      state.pendingDataRef.current = null
      initCy(pending)
      return
    }
    // refresh / direct navigation: restore from sessionStorage
    const saved = sessionStorage.getItem('codeflow_data')
    if (saved) {
      try {
        initCy(JSON.parse(saved))
      } catch {
        sessionStorage.removeItem('codeflow_data')
        navigate({ to: '/codeflow' })
      }
    } else {
      navigate({ to: '/codeflow' })
    }
  }, [])

  const {
    containerRef,
    selected,
    stats,
    deadCount,
    deadNodeIds,
    showDead,
    setShowDead,
    search,
    setSearch,
    activeTypes,
    setActiveTypes,
    activeDirectories,
    setActiveDirectories,
    availableDirectories,
    filterOpen,
    setFilterOpen,
    legendOpen,
    setLegendOpen,
    whiteBg,
    setIsDragging,
  } = state

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        search={search}
        selected={selected}
        deadNodeIds={deadNodeIds}
        filteredNodes={filteredNodes}
        deadCount={deadCount}
        showDead={showDead}
        availableDirectories={availableDirectories}
        activeDirectories={activeDirectories}
        availableTypes={availableTypes}
        activeTypes={activeTypes}
        filterOpen={filterOpen}
        legendOpen={legendOpen}
        onToggleType={toggleType}
        onSearchChange={setSearch}
        onShowDead={() => setShowDead((v) => !v)}
        onToggleDirectory={(dir) =>
          setActiveDirectories((prev) => {
            const next = new Set(prev)
            if (next.has(dir)) next.delete(dir)
            else next.add(dir)
            return next
          })
        }
        onSelectAllTypes={() => setActiveTypes(new Set(availableTypes))}
        onClearTypes={() => setActiveTypes(new Set())}
        onToggleFilter={() => setFilterOpen((o) => !o)}
        onToggleLegend={() => setLegendOpen((v) => !v)}
        onNodeSelection={goToNode}
      />

      {/* Graph canvas */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        <div
          className="flex-1 relative transition-colors duration-300"
          style={{ background: whiteBg ? '#ffffff' : undefined }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const f = e.dataTransfer.files[0]
            if (f) readFile(f)
          }}
        >
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 px-5 py-2 bg-(--chat-input-bg) border-t border-(--chat-border) text-xs text-(--chat-muted) shrink-0">
          <span>
            Nodes:{' '}
            <span className="text-(--chat-text) font-medium">
              {stats.nodes}
            </span>
          </span>
          <span>
            Edges:{' '}
            <span className="text-(--chat-text) font-medium">
              {stats.edges}
            </span>
          </span>
          <span>
            Files:{' '}
            <span className="text-(--chat-text) font-medium">
              {stats.files}
            </span>
          </span>
          {deadCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle size={10} />
              <span>
                <span className="font-medium">{deadCount}</span> dead
              </span>
            </span>
          )}
          {selected && (
            <span>
              Selected:{' '}
              <span className="text-(--chat-accent) font-medium">
                {selected.label}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && selectedTypeColor && (
        <DetailSection
          selected={selected}
          typeColor={selectedTypeColor}
          isDead={selectedIsDead}
          dir={selectedDir}
          clearDetail={clearDetail}
          goToNode={goToNode}
        />
      )}
    </div>
  )
}

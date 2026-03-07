import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'
import { TYPE_COLORS, CODEGEN_PROMPT } from './codeflow/_lib/constants'

import { Header } from './codeflow/_components/header'
import { HelpModal } from './codeflow/_components/help-modal'
import { getTopDirectory } from './codeflow/_lib/helpers'
import { useCodeflow } from './codeflow/_hooks/useCodeflow'
import { useGraphFilters } from './codeflow/_hooks/useGraphFilters'
import { useGraphInit } from './codeflow/_hooks/useGraphInit'
import { CodeflowCtx } from './codeflow/_lib/context'
import type { GraphData } from './codeflow/_lib/types'

export const Route = createFileRoute('/codeflow')({
  component: CodeflowLayout,
})

function CodeflowLayout() {
  const navigate = useNavigate()
  const state = useCodeflow()
  const {
    cyRef,
    whiteBgRef,
    showDeadRef,
    focusModeRef,
    pendingDataRef,
    selected,
    nodeList,
    deadNodeIds,
    showDead,
    search,
    activeTypes,
    setActiveTypes,
    activeDirectories,
    helpOpen,
    setHelpOpen,
    whiteBg,
    copied,
    setCopied,
    error,
  } = state

  const { showError, clearDetail, showDetail, goToNode } =
    useGraphFilters(state)

  const {
    initCy,
    parseAndLoad,
    readFile,
    handleReset,
    handleBackToUpload: resetState,
  } = useGraphInit({ ...state, showDetail, clearDetail, showError })

  /* navigate to visualization, storing data for initCy to pick up on mount */
  const loadData = useCallback(
    (data: GraphData) => {
      pendingDataRef.current = data
      navigate({ to: '/codeflow/visualization' })
    },
    [navigate, pendingDataRef],
  )

  const handleBackToUpload = () => {
    resetState()
    navigate({ to: '/codeflow' })
  }

  /* whiteBgRef / showDeadRef sync */
  useEffect(() => {
    whiteBgRef.current = whiteBg
  }, [whiteBg])
  useEffect(() => {
    showDeadRef.current = showDead
  }, [showDead])

  /* edge color sync with whiteBg */
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    if (focusModeRef.current || cy.edges('.highlighted').length > 0) return
    const edgeColor = whiteBg ? '#000000' : '#ffffff'
    cy.edges().style({
      'line-color': edgeColor,
      'target-arrow-color': edgeColor,
    })
  }, [whiteBg])

  const copyPrompt = () => {
    navigator.clipboard.writeText(CODEGEN_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* derived values — computed here so both children get the same reference */
  const filteredNodes = nodeList
    .filter((n) => {
      const type = n.type ?? 'function'
      const dir = getTopDirectory(n.file ?? '')
      if (!activeTypes.has(type)) return false
      if (!activeDirectories.has(dir)) return false
      if (!showDead && deadNodeIds.has(String(n.id))) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        (n.label ?? '').toLowerCase().includes(q) ||
        (n.file ?? '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const aDead = deadNodeIds.has(String(a.id)) ? 0 : 1
      const bDead = deadNodeIds.has(String(b.id)) ? 0 : 1
      return aDead - bDead
    })

  const availableTypes = [...new Set(nodeList.map((n) => n.type ?? 'function'))]

  const toggleType = (type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const selectedTypeColor = selected
    ? (TYPE_COLORS[selected.type] ?? TYPE_COLORS.function)
    : null
  const selectedIsDead = selected ? deadNodeIds.has(selected.id) : false
  const selectedDir = selected?.file ? selected.file.split(/[/\\]/)[0] : ''

  const ctx = {
    state,
    initCy: (data: Parameters<typeof initCy>[0]) => initCy(data),
    loadData,
    parseAndLoad,
    readFile,
    handleReset,
    handleBackToUpload,
    clearDetail,
    showDetail,
    showError,
    goToNode,
    copyPrompt,
    filteredNodes,
    availableTypes,
    toggleType,
    selectedTypeColor,
    selectedIsDead,
    selectedDir,
  }

  return (
    <CodeflowCtx.Provider value={ctx}>
      <div className="flex flex-col h-screen bg-(--chat-bg) font-body overflow-hidden text-(--chat-text)">
        {/* Header */}
        <Header />
        <Outlet />
        {/* Error toast */}
        {error && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-red-950 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg text-sm shadow-lg">
            {error}
          </div>
        )}
        {/* Help modal */}
        {helpOpen && (
          <HelpModal
            onClose={() => setHelpOpen(false)}
            onCopyPrompt={copyPrompt}
            copied={copied}
          />
        )}
      </div>
    </CodeflowCtx.Provider>
  )
}

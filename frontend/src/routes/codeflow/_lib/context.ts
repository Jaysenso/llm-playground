import { createContext, useContext } from 'react'
import type cytoscape from 'cytoscape'
import type { NodeDef, GraphData } from './types'
import type { useCodeflow } from '../_hooks/useCodeflow'

export interface CodeflowContextValue {
  // full state bag — child routes destructure what they need
  state: ReturnType<typeof useCodeflow>
  // graph init
  initCy: (data: GraphData) => void
  loadData: (data: GraphData) => void
  parseAndLoad: (text: string) => void
  readFile: (file: File) => void
  handleReset: () => void
  handleBackToUpload: () => void
  // interaction
  clearDetail: () => void
  showDetail: (node: cytoscape.NodeSingular, showPredecessors?: boolean) => void
  goToNode: (id: string) => void
  // ui
  showError: (msg: string) => void
  copyPrompt: () => void
  // derived (computed in layout, shared to avoid re-computing in children)
  filteredNodes: NodeDef[]
  availableTypes: string[]
  toggleType: (type: string) => void
  selectedTypeColor: { bg: string; border: string; text: string } | null
  selectedIsDead: boolean
  selectedDir: string
}

export const CodeflowCtx = createContext<CodeflowContextValue | null>(null)

export function useCodeflowContext(): CodeflowContextValue {
  const ctx = useContext(CodeflowCtx)
  if (!ctx)
    throw new Error('useCodeflowContext must be used within CodeflowLayout')
  return ctx
}

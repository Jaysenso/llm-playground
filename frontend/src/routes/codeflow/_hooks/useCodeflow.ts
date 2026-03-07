import { useState, useRef } from 'react'
import type { SelectedNode, NodeDef, GraphData } from '../_lib/types'
import type cytoscape from 'cytoscape'

export function useCodeflow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const focusModeRef = useRef(false)
  const activeTypesRef = useRef<Set<string>>(new Set())
  const activeDirectoriesRef = useRef<Set<string>>(new Set())
  const searchRef = useRef('')
  const whiteBgRef = useRef(false)
  const showDeadRef = useRef(true)
  const pendingDataRef = useRef<GraphData | null>(null)

  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<SelectedNode | null>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [search, setSearch] = useState('')
  const [nodeList, setNodeList] = useState<NodeDef[]>([])
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set())
  const [activeDirectories, setActiveDirectories] = useState<Set<string>>(
    new Set(),
  )
  const [availableDirectories, setAvailableDirectories] = useState<string[]>([])
  const [stats, setStats] = useState({ nodes: 0, edges: 0, files: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [pasteJson, setPasteJson] = useState('')
  const [error, setError] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [whiteBg, setWhiteBg] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmAction, setConfirmAction] = useState<
    'reset' | 'newfile' | null
  >(null)
  const [deadCount, setDeadCount] = useState(0)
  const [deadNodeIds, setDeadNodeIds] = useState<Set<string>>(new Set())
  const [showDead, setShowDead] = useState(true)
  return {
    // refs
    containerRef,
    cyRef,
    focusModeRef,
    activeTypesRef,
    activeDirectoriesRef,
    searchRef,
    whiteBgRef,
    showDeadRef,
    pendingDataRef,

    // graph
    loaded,
    setLoaded,
    selected,
    setSelected,
    nodeList,
    setNodeList,
    stats,
    setStats,
    deadCount,
    setDeadCount,
    deadNodeIds,
    setDeadNodeIds,
    showDead,
    setShowDead,

    // filters
    search,
    setSearch,
    activeTypes,
    setActiveTypes,
    activeDirectories,
    setActiveDirectories,
    availableDirectories,
    setAvailableDirectories,

    // ui toggles
    focusMode,
    setFocusMode,
    filterOpen,
    setFilterOpen,
    legendOpen,
    setLegendOpen,
    helpOpen,
    setHelpOpen,
    whiteBg,
    setWhiteBg,
    copied,
    setCopied,

    // actions
    isDragging,
    setIsDragging,
    pasteJson,
    setPasteJson,
    error,
    setError,
    confirmAction,
    setConfirmAction,
  }
}

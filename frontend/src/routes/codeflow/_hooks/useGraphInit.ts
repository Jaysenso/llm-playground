import { useEffect, useCallback } from 'react'
import cytoscape from 'cytoscape'
// @ts-ignore
import cytoscapeDagre from 'cytoscape-dagre'
import type { GraphData } from '../_lib/types'
import { TYPE_COLORS, DAGRE_LAYOUT, CY_STYLE } from '../_lib/constants'
import { findBackEdges, getTopDirectory } from '../_lib/helpers'
import type { useCodeflow } from './useCodeflow'

cytoscape.use(cytoscapeDagre)

type State = ReturnType<typeof useCodeflow>

export function useGraphInit({
  containerRef,
  cyRef,
  setLoaded,
  setSelected,
  setNodeList,
  setStats,
  setDeadCount,
  setDeadNodeIds,
  setActiveTypes,
  setActiveDirectories,
  setAvailableDirectories,
  nodeList,
  availableDirectories,
  setSearch,
  setFocusMode,
  setPasteJson,
  whiteBgRef,
  showDetail,
  clearDetail,
  showError,
}: Pick<
  State,
  | 'containerRef'
  | 'cyRef'
  | 'setLoaded'
  | 'setSelected'
  | 'setNodeList'
  | 'setStats'
  | 'setDeadCount'
  | 'setDeadNodeIds'
  | 'setActiveTypes'
  | 'setActiveDirectories'
  | 'setAvailableDirectories'
  | 'nodeList'
  | 'availableDirectories'
  | 'setSearch'
  | 'setFocusMode'
  | 'setPasteJson'
  | 'whiteBgRef'
> & {
  showDetail: (node: cytoscape.NodeSingular, showPredecessors?: boolean) => void
  clearDetail: () => void
  showError: (msg: string) => void
}) {
  /* cleanup on unmount */
  useEffect(
    () => () => {
      cyRef.current?.destroy()
    },
    [],
  )

  const initCy = useCallback(
    (data: GraphData) => {
      if (!containerRef.current) return
      try {
        if (!Array.isArray(data.nodes))
          throw new Error('"nodes" must be an array')
        if (!Array.isArray(data.edges))
          throw new Error('"edges" must be an array')

        const backEdges = findBackEdges(data.nodes, data.edges)
        const nodeIds = new Set(data.nodes.map((n) => String(n.id)))
        const elements: cytoscape.ElementDefinition[] = []

        const inDegree: Record<string, number> = {}
        data.nodes.forEach((n) => {
          inDegree[String(n.id)] = 0
        })
        data.edges.forEach((e) => {
          const t = String(e.to)
          if (t in inDegree) inDegree[t]++
        })
        const deadSet = new Set(
          data.nodes
            .filter((n) => inDegree[String(n.id)] === 0 && n.type !== 'entry')
            .map((n) => String(n.id)),
        )

        data.nodes.forEach((n) => {
          const c = TYPE_COLORS[n.type ?? 'function'] ?? TYPE_COLORS.function
          elements.push({
            data: {
              id: String(n.id),
              label: n.label ?? n.id,
              file: n.file ?? '',
              directory: getTopDirectory(n.file ?? ''),
              type: n.type ?? 'function',
              description: n.description ?? '',
              bgColor: c.bg,
              borderColor: c.border,
              textColor: c.text,
              dead: deadSet.has(String(n.id)) ? 'yes' : '',
            },
          })
        })

        data.edges.forEach((e, i) => {
          if (!nodeIds.has(String(e.from)) || !nodeIds.has(String(e.to))) return
          const isBack = backEdges.has(`${e.from}→${e.to}`)
          elements.push({
            data: {
              id: `e_${i}`,
              source: String(e.from),
              target: String(e.to),
              label: e.label ?? '',
              isBack: isBack ? 'yes' : '',
            },
          })
        })

        cyRef.current?.destroy()
        cyRef.current = null
        cyRef.current = cytoscape({
          container: containerRef.current,
          elements,
          style: CY_STYLE,
          layout: DAGRE_LAYOUT,
          wheelSensitivity: 2.5,
        })

        if (whiteBgRef.current) {
          cyRef.current.edges().style({ 'line-color': '#000000', 'target-arrow-color': '#000000' })
        }

        cyRef.current.on('tap', 'node', (e) => {
          const orig = e.originalEvent as MouseEvent
          showDetail(e.target, orig.ctrlKey || orig.metaKey)
        })
        cyRef.current.on('tap', (evt) => {
          if (evt.target === cyRef.current) clearDetail()
        })

        setDeadCount(deadSet.size)
        setDeadNodeIds(new Set(deadSet))

        const allTypes = new Set(data.nodes.map((n) => n.type ?? 'function'))
        setActiveTypes(allTypes)

        const allDirs = [
          ...new Set(data.nodes.map((n) => getTopDirectory(n.file ?? ''))),
        ].sort()
        setAvailableDirectories(allDirs)
        setActiveDirectories(new Set(allDirs))

        setNodeList(
          [...data.nodes].sort((a, b) =>
            (a.label ?? '').localeCompare(b.label ?? ''),
          ),
        )
        setStats({
          nodes: data.nodes.length,
          edges: data.edges.length,
          files: new Set(data.nodes.map((n) => n.file).filter(Boolean)).size,
        })
        setLoaded(true)
        setSelected(null)
        sessionStorage.setItem('codeflow_data', JSON.stringify(data))
      } catch (err) {
        showError('Error loading graph: ' + (err as Error).message)
      }
    },
    [showDetail, clearDetail, showError],
  )

  const parseAndLoad = useCallback(
    (text: string) => {
      try {
        const data = JSON.parse(text)
        if (!data.nodes || !data.edges)
          throw new Error('"nodes" and "edges" arrays required')
        initCy(data)
      } catch (err) {
        showError('Invalid JSON: ' + (err as Error).message)
      }
    },
    [initCy, showError],
  )

  const readFile = useCallback(
    (file: File) => {
      const r = new FileReader()
      r.onload = (e) => parseAndLoad(e.target?.result as string)
      r.readAsText(file)
    },
    [parseAndLoad],
  )

  const handleReset = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    clearDetail()
    setSearch('')
    setFocusMode(false)
    setActiveTypes(new Set(nodeList.map((n) => n.type ?? 'function')))
    setActiveDirectories(new Set(availableDirectories))
    cy.elements().removeStyle()
    if (whiteBgRef.current) {
      cy.edges().style({
        'line-color': '#000000',
        'target-arrow-color': '#000000',
      })
    }
    cy.layout(DAGRE_LAYOUT).run()
  }, [clearDetail, nodeList, availableDirectories])

  const handleBackToUpload = useCallback(() => {
    sessionStorage.removeItem('codeflow_data')
    cyRef.current?.destroy()
    cyRef.current = null
    setLoaded(false)
    setSelected(null)
    setNodeList([])
    setActiveTypes(new Set())
    setActiveDirectories(new Set())
    setAvailableDirectories([])
    setPasteJson('')
    setFocusMode(false)
    setSearch('')
    setDeadCount(0)
    setDeadNodeIds(new Set())
  }, [])

  return { initCy, parseAndLoad, readFile, handleReset, handleBackToUpload }
}

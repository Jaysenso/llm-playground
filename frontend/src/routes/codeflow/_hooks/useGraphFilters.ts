import { useEffect, useCallback } from 'react'
import cytoscape from 'cytoscape'
import type { NodeType } from '../_lib/types'
import type { useCodeflow } from './useCodeflow'

type State = ReturnType<typeof useCodeflow>

export function useGraphFilters({
  cyRef,
  focusModeRef,
  activeTypesRef,
  activeDirectoriesRef,
  searchRef,
  whiteBgRef,
  showDeadRef,
  focusMode,
  search,
  activeTypes,
  activeDirectories,
  showDead,
  setSelected,
  setError,
}: Pick<
  State,
  | 'cyRef'
  | 'focusModeRef'
  | 'activeTypesRef'
  | 'activeDirectoriesRef'
  | 'searchRef'
  | 'whiteBgRef'
  | 'showDeadRef'
  | 'focusMode'
  | 'search'
  | 'activeTypes'
  | 'activeDirectories'
  | 'showDead'
  | 'setSelected'
  | 'setError'
>) {
  /* keep refs in sync with state */
  useEffect(() => {
    focusModeRef.current = focusMode
  }, [focusMode])
  useEffect(() => {
    activeTypesRef.current = activeTypes
  }, [activeTypes])
  useEffect(() => {
    activeDirectoriesRef.current = activeDirectories
  }, [activeDirectories])
  useEffect(() => {
    searchRef.current = search
  }, [search])

  /* combined search + type + directory + dead filter */
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    const q = search.toLowerCase()
    cy.nodes().forEach((n) => {
      const type = n.data('type') as string
      const dir = n.data('directory') as string
      const isDead = n.data('dead') === 'yes'
      if (
        !activeTypes.has(type) ||
        !activeDirectories.has(dir) ||
        (isDead && !showDead)
      ) {
        n.style('display', 'none')
        return
      }
      const match =
        !q ||
        n.data('label').toLowerCase().includes(q) ||
        n.data('file').toLowerCase().includes(q)
      n.style('display', match ? 'element' : 'none')
    })
    cy.edges().forEach((e) => {
      const src = e.source()
      const tgt = e.target()
      const srcVisible =
        activeTypes.has(src.data('type')) &&
        activeDirectories.has(src.data('directory')) &&
        !(src.data('dead') === 'yes' && !showDead) &&
        (!q ||
          src.data('label').toLowerCase().includes(q) ||
          src.data('file').toLowerCase().includes(q))
      const tgtVisible =
        activeTypes.has(tgt.data('type')) &&
        activeDirectories.has(tgt.data('directory')) &&
        !(tgt.data('dead') === 'yes' && !showDead) &&
        (!q ||
          tgt.data('label').toLowerCase().includes(q) ||
          tgt.data('file').toLowerCase().includes(q))
      e.style('display', srcVisible && tgtVisible ? 'element' : 'none')
    })
  }, [search, activeTypes, activeDirectories, showDead])

  const showError = useCallback((msg: string) => {
    setError(msg)
    setTimeout(() => setError(''), 4000)
  }, [])

  const clearDetail = useCallback(() => {
    setSelected(null)
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('highlighted')
    const types = activeTypesRef.current
    const dirs = activeDirectoriesRef.current
    const q = searchRef.current.toLowerCase()
    const showDeadNodes = showDeadRef.current
    cy.nodes().forEach((n) => {
      const type = n.data('type') as string
      const dir = n.data('directory') as string
      const isDead = n.data('dead') === 'yes'
      if (!types.has(type) || !dirs.has(dir) || (isDead && !showDeadNodes)) {
        n.style('display', 'none')
        return
      }
      const match =
        !q ||
        n.data('label').toLowerCase().includes(q) ||
        n.data('file').toLowerCase().includes(q)
      n.style('display', match ? 'element' : 'none')
    })
    const baseEdgeColor = whiteBgRef.current ? '#000000' : '#ffffff'
    cy.edges().forEach((e) => {
      const src = e.source()
      const tgt = e.target()
      const srcVisible =
        types.has(src.data('type')) &&
        dirs.has(src.data('directory')) &&
        !(src.data('dead') === 'yes' && !showDeadNodes) &&
        (!q ||
          src.data('label').toLowerCase().includes(q) ||
          src.data('file').toLowerCase().includes(q))
      const tgtVisible =
        types.has(tgt.data('type')) &&
        dirs.has(tgt.data('directory')) &&
        !(tgt.data('dead') === 'yes' && !showDeadNodes) &&
        (!q ||
          tgt.data('label').toLowerCase().includes(q) ||
          tgt.data('file').toLowerCase().includes(q))
      e.style('display', srcVisible && tgtVisible ? 'element' : 'none')
      e.style('opacity', 1)
      e.style('line-color', baseEdgeColor)
      e.style('target-arrow-color', baseEdgeColor)
    })
  }, [])

  const showDetail = useCallback(
    (node: cytoscape.NodeSingular, showPredecessors = false) => {
      const id = node.id()
      const d = node.data()
      const cy = cyRef.current
      if (!cy) return

      const calls = cy.edges(`[source="${id}"]`).map((e) => ({
        id: e.data('target'),
        label: cy.$id(e.data('target')).data('label') || e.data('target'),
        edgeLabel: e.data('label'),
        type: cy.$id(e.data('target')).data('type') as NodeType,
      }))
      const calledBy = cy.edges(`[target="${id}"]`).map((e) => ({
        id: e.data('source'),
        label: cy.$id(e.data('source')).data('label') || e.data('source'),
        edgeLabel: e.data('label'),
        type: cy.$id(e.data('source')).data('type') as NodeType,
      }))

      setSelected({
        id,
        label: d.label,
        file: d.file,
        type: d.type,
        description: d.description,
        calls,
        calledBy,
      })

      const succs = node.successors()
      const relevant =
        focusModeRef.current || showPredecessors
          ? node.union(succs).union(node.predecessors())
          : node.union(succs)

      cy.elements().removeClass('highlighted')
      cy.nodes().forEach((n) => {
        if (relevant.has(n)) {
          n.style('display', 'element')
          n.style('opacity', 1)
          n.addClass('highlighted')
        } else {
          n.style('display', 'none')
        }
      })
      const baseEdgeColor = whiteBgRef.current ? '#000000' : '#ffffff'
      cy.edges().forEach((e) => {
        if (relevant.has(e)) {
          e.style('display', 'element')
          e.style('opacity', 1)
          e.style('line-color', '#a78bfa')
          e.style('target-arrow-color', '#a78bfa')
          e.addClass('highlighted')
        } else {
          e.style('display', 'none')
          e.style('line-color', baseEdgeColor)
          e.style('target-arrow-color', baseEdgeColor)
        }
      })
    },
    [],
  )

  const goToNode = useCallback(
    (id: string) => {
      const cy = cyRef.current
      if (!cy) return
      const node = cy.$id(id)
      if (!node.length) return
      showDetail(node)
    },
    [showDetail],
  )

  return { showError, clearDetail, showDetail, goToNode }
}

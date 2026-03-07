import type { NodeDef, EdgeDef } from './types'

/* ── Cycle detection ───────────────────────────────────── */
export function findBackEdges(nodes: NodeDef[], edges: EdgeDef[]): Set<string> {
  const adj: Record<string, string[]> = {}
  nodes.forEach((n) => {
    adj[String(n.id)] = []
  })
  edges.forEach((e) => {
    adj[String(e.from)]?.push(String(e.to))
  })

  const visited = new Set<string>()
  const inStack = new Set<string>()
  const back = new Set<string>()

  function dfs(node: string) {
    visited.add(node)
    inStack.add(node)
    for (const nb of adj[node] ?? []) {
      if (!visited.has(nb)) dfs(nb)
      else if (inStack.has(nb)) back.add(`${node}→${nb}`)
    }
    inStack.delete(node)
  }
  nodes.forEach((n) => {
    if (!visited.has(String(n.id))) dfs(String(n.id))
  })
  return back
}

export function getTopDirectory(file: string): string {
  if (!file) return '(root)'
  const parts = file.replace(/\\/g, '/').split('/').filter(Boolean)
  return parts.length > 1 ? parts[0] : '(root)'
}

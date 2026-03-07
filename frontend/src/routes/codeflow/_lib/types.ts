/* ── Types ─────────────────────────────────────────────── */
export type NodeType =
  | 'entry'
  | 'function'
  | 'class'
  | 'hook'
  | 'api'
  | 'component'
  | 'middleware'
  | 'config'
  | 'singleton'
  | 'service'
  | 'router'

export const TYPE_DESCRIPTIONS: Record<string, string> = {
  entry: 'App or module entry point — where execution begins',
  function: 'Plain utility or helper function',
  class: 'Class definition',
  hook: 'React hook (use*)',
  api: 'API route or endpoint handler',
  component: 'UI component',
  middleware: 'Request/response middleware',
  config: 'Configuration or environment module',
  singleton: 'Single shared instance',
  service: 'Business logic or data-access service',
  router: 'Route handler or router definition',
}

export const TYPE_LABELS: Record<NodeType, string> = {
  entry: 'entry',
  function: 'func.',
  class: 'class',
  hook: 'hook',
  api: 'api',
  component: 'comp.',
  middleware: 'mw.',
  config: 'cfg.',
  singleton: 'single.',
  service: 'svc.',
  router: 'route.',
}

export interface NodeDef {
  id: string
  label?: string
  file?: string
  type?: NodeType
  description?: string
}

export interface EdgeDef {
  from: string
  to: string
  label?: string
}

export interface GraphData {
  nodes: NodeDef[]
  edges: EdgeDef[]
}

export interface Neighbor {
  id: string
  label: string
  edgeLabel: string
  type?: NodeType
}

export interface SelectedNode {
  id: string
  label: string
  file: string
  type: NodeType
  description: string
  calls: Neighbor[]
  calledBy: Neighbor[]
}

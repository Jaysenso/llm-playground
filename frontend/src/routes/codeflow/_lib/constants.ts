import type { GraphData, NodeType } from './types'

export const CODEGEN_PROMPT = `Analyze this entire codebase and generate a codeflow.json file that maps the call graph and architecture.

Output a single JSON file with this exact structure:
{
  "nodes": [
    {
      "id": "unique-string-id",
      "label": "functionOrClassName",
      "file": "relative/path/to/file.ts",
      "type": "entry|function|class|hook|api|component|middleware|config|singleton|service|router|schema|model",
      "description": "One sentence — what this does"
    }
  ],
  "edges": [
    {
      "from": "source-id",
      "to": "target-id",
      "label": "calls"
    }
  ]
}

Rules:
- Cover all significant functions, classes, components, hooks, API routes, services, middleware, and entry points
- "file" must be relative to the project root (e.g. "src/routes/auth.ts")
- "type" must be one of: entry, function, class, hook, api, component, middleware, config, singleton, service, router, schema, model
- "id" must be unique (use descriptive slugs like "auth-middleware" or "useAuthHook")
- Add an edge for every meaningful call, import dependency, or inheritance relationship
- Focus on architectural relationships — skip trivial one-liner utilities
- Entry points (main files, app bootstraps, route indexes) should use type "entry"

Type guidance:
- Pydantic models and dataclasses → "model"
- Zod/Yup/Joi schemas, TypeScript interfaces used for validation → "schema"
- Database models (SQLAlchemy, Prisma, Mongoose, Django ORM) → "model"
- React/Vue/Svelte UI components → "component"
- React hooks, Vue composables → "hook"
- Express/FastAPI/Django route handlers → "api"
- Classes that manage shared state or are instantiated once → "singleton"
- Abstract or base classes, regular OOP classes → "class"
- Environment/settings/constants files → "config"
- Edge labels should reflect the relationship: "calls", "extends", "instantiates", "imports", "validates", "reads", "writes"

Save the result as codeflow.json in the project root.`

/* ── export export constants ─────────────────────────────────────────── */

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

export const DIRECTORY_PALETTE = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#8b5cf6',
  '#84cc16',
]
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

export const TYPE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  entry: { bg: '#4c1d95', border: '#a78bfa', text: '#ede9fe' },
  function: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  class: { bg: '#1c3a2f', border: '#10b981', text: '#6ee7b7' },
  hook: { bg: '#3a2f1c', border: '#f59e0b', text: '#fcd34d' },
  api: { bg: '#3a1c1c', border: '#ef4444', text: '#fca5a5' },
  component: { bg: '#1c2f3a', border: '#0ea5e9', text: '#7dd3fc' },
  middleware: { bg: '#2d2a1c', border: '#d97706', text: '#fde68a' },
  config: { bg: '#1e2030', border: '#64748b', text: '#94a3b8' },
  singleton: { bg: '#1a2f2f', border: '#14b8a6', text: '#5eead4' },
  service: { bg: '#2d1c3a', border: '#c084fc', text: '#e9d5ff' },
  router: { bg: '#2a1c2a', border: '#f472b6', text: '#fbcfe8' },
}

export const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  entry: { bg: '#7c3aed33', text: '#a78bfa' },
  function: { bg: '#1e3a5f', text: '#60a5fa' },
  class: { bg: '#1c3a2f', text: '#34d399' },
  hook: { bg: '#3a2f1c', text: '#fbbf24' },
  api: { bg: '#3a1c1c', text: '#f87171' },
  component: { bg: '#1c2f3a', text: '#38bdf8' },
  middleware: { bg: '#2d2a1c', text: '#fcd34d' },
  config: { bg: '#1e2030', text: '#94a3b8' },
  singleton: { bg: '#1a2f2f', text: '#2dd4bf' },
  service: { bg: '#2d1c3a', text: '#c084fc' },
  router: { bg: '#2a1c2a', text: '#f472b6' },
}

export const DAGRE_LAYOUT = {
  name: 'dagre',
  rankDir: 'TB',
  rankSep: 120,
  nodeSep: 40,
  edgeSep: 40,
  ranker: 'network-simplex',
  animate: true,
  animationDuration: 400,
  padding: 20,
  avoidOverlap: true,
}

export const CY_STYLE: cytoscape.StylesheetStyle[] = [
  {
    selector: 'node',
    style: {
      'background-color': 'data(bgColor)',
      'border-color': 'data(borderColor)',
      'border-width': 2,
      color: 'data(textColor)',
      label: 'data(label)',
      'font-size': 14,
      'font-weight': 'bold',
      'font-family': '"DM Sans", system-ui, sans-serif',
      'text-valign': 'center',
      'text-halign': 'center',
      padding: '12',
      shape: 'roundrectangle',
      width: 'label',
      height: 'label',
      'text-wrap': 'wrap',
      'text-max-width': '140',
    },
  },
  {
    selector: 'node[type="entry"]',
    style: { 'border-width': 3, 'font-weight': 700, 'font-size': 13 },
  },
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': '#ffffff',
      'target-arrow-color': '#ffffff',
      'target-arrow-shape': 'triangle',
      'curve-style': 'taxi',
      'taxi-direction': 'downward',
      'taxi-turn': '50%',
      'taxi-turn-min-distance': 40,
      'arrow-scale': 1,
      label: '',
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge[isBack="yes"]',
    style: {
      'line-style': 'dashed',
      'line-dash-pattern': [6, 3],
      'line-color': '#ef444440',
      'target-arrow-color': '#ef444440',
      'curve-style': 'bezier',
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'node[dead="yes"]',
    style: {
      'border-style': 'dashed',
      'border-color': '#f59e0b',
      'border-width': 2,
    },
  },
  {
    selector: 'node.highlighted',
    style: { 'border-color': '#a78bfa', 'border-width': 3, opacity: 1 },
  },
  {
    selector: 'edge.highlighted',
    style: {
      'line-color': '#a78bfa',
      'target-arrow-color': '#a78bfa',
      width: 3,
      opacity: 1,
    } as cytoscape.Css.Edge,
  },
]
/* ── Demo data ─────────────────────────────────────────── */
export const DEMO_DATA: GraphData = {
  nodes: [
    {
      id: 'main',
      label: 'main',
      file: 'backend/main.py',
      type: 'entry',
      description: 'FastAPI app entry point',
    },
    {
      id: 'apirouter',
      label: 'api_router',
      file: 'backend/app/api/v1/api.py',
      type: 'function',
      description: 'Combines all v1 route handlers',
    },
    {
      id: 'chatroute',
      label: 'chat_router',
      file: 'backend/app/api/routes/chat.py',
      type: 'api',
      description: 'POST /chat endpoint',
    },
    {
      id: 'authroute',
      label: 'auth_router',
      file: 'backend/app/api/routes/auth.py',
      type: 'api',
      description: 'POST /login /logout endpoints',
    },
    {
      id: 'userroute',
      label: 'user_router',
      file: 'backend/app/api/routes/user.py',
      type: 'api',
      description: 'GET/PATCH /user endpoints',
    },
    {
      id: 'healthroute',
      label: 'health_router',
      file: 'backend/app/api/routes/health.py',
      type: 'api',
      description: 'GET /health endpoint',
    },
    {
      id: 'chatservice',
      label: 'ChatService',
      file: 'backend/app/api/services/chat_service.py',
      type: 'class',
      description: 'Orchestrates chat logic and streaming',
    },
    {
      id: 'authservice',
      label: 'AuthService',
      file: 'backend/app/api/services/auth_service.py',
      type: 'class',
      description: 'Handles login, token validation',
    },
    {
      id: 'userservice',
      label: 'UserService',
      file: 'backend/app/api/services/user_service.py',
      type: 'class',
      description: 'Handles user CRUD',
    },
    {
      id: 'clientfactory',
      label: 'ClientFactory',
      file: 'backend/app/api/clients/factory.py',
      type: 'class',
      description: 'Returns correct LLM client',
    },
    {
      id: 'ollamaclient',
      label: 'OllamaClient',
      file: 'backend/app/api/clients/ollama_client.py',
      type: 'class',
      description: 'Local Ollama instance',
    },
    {
      id: 'openrouterclient',
      label: 'OpenRouterClient',
      file: 'backend/app/api/clients/openrouter_client.py',
      type: 'class',
      description: 'OpenRouter API client',
    },
    {
      id: 'anthropicclient',
      label: 'AnthropicClient',
      file: 'backend/app/api/clients/anthropic_client.py',
      type: 'class',
      description: 'Anthropic Claude API client',
    },
    {
      id: 'openaiclient',
      label: 'OpenAIClient',
      file: 'backend/app/api/clients/openai_client.py',
      type: 'class',
      description: 'OpenAI API client',
    },
    {
      id: 'config',
      label: 'config',
      file: 'backend/app/core/config.py',
      type: 'class',
      description: 'Loads env vars and app settings',
    },
    {
      id: 'logger',
      label: 'logger',
      file: 'backend/app/core/logger.py',
      type: 'function',
      description: 'Structured logging setup',
    },
    {
      id: 'prompts',
      label: 'prompts',
      file: 'backend/app/core/prompts.py',
      type: 'function',
      description: 'System prompt templates',
    },
    {
      id: 'types',
      label: 'types',
      file: 'backend/app/core/types.py',
      type: 'class',
      description: 'Shared Pydantic models',
    },
    {
      id: 'middleware',
      label: 'middleware',
      file: 'backend/app/core/middleware.py',
      type: 'function',
      description: 'CORS, auth, rate limit middleware',
    },
  ],
  edges: [
    { from: 'main', to: 'apirouter', label: 'includes' },
    { from: 'main', to: 'config', label: 'loads' },
    { from: 'main', to: 'logger', label: 'init' },
    { from: 'main', to: 'middleware', label: 'registers' },
    { from: 'apirouter', to: 'chatroute', label: '/chat' },
    { from: 'apirouter', to: 'authroute', label: '/auth' },
    { from: 'apirouter', to: 'userroute', label: '/user' },
    { from: 'apirouter', to: 'healthroute', label: '/health' },
    { from: 'chatroute', to: 'chatservice', label: 'delegates' },
    { from: 'authroute', to: 'authservice', label: 'delegates' },
    { from: 'userroute', to: 'userservice', label: 'delegates' },
    { from: 'chatservice', to: 'clientfactory', label: 'get client' },
    { from: 'chatservice', to: 'prompts', label: 'system prompt' },
    { from: 'chatservice', to: 'types', label: 'ChatRequest/Response' },
    { from: 'chatservice', to: 'logger', label: 'logs stream' },
    { from: 'clientfactory', to: 'ollamaclient', label: 'if ollama' },
    { from: 'clientfactory', to: 'openrouterclient', label: 'if openrouter' },
    { from: 'clientfactory', to: 'anthropicclient', label: 'if anthropic' },
    { from: 'clientfactory', to: 'openaiclient', label: 'if openai' },
    { from: 'clientfactory', to: 'config', label: 'reads provider' },
    { from: 'authservice', to: 'config', label: 'reads secret' },
    { from: 'authservice', to: 'types', label: 'TokenPayload' },
    { from: 'userservice', to: 'types', label: 'UserModel' },
    { from: 'middleware', to: 'config', label: 'reads CORS origins' },
  ],
}

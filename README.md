# LLM App

A fullstack LLM chat application with a Python FastAPI backend and a React/TypeScript frontend. Supports streaming responses via [OpenRouter](https://openrouter.ai/) or a local [Ollama](https://ollama.com/) instance. Includes a second tool — **Codeflow** — an interactive call graph visualizer powered by Cytoscape.js.

## Project Structure

```

llm-app/

├── backend/

│ ├── main.py # FastAPI entry point, CORS config, router mount

│ ├── config.yaml # Model, provider, and app settings

│ ├── pyproject.toml # Python dependencies (uv)

│ └── app/

│ ├── core/

│ │ ├── config.py # Settings (pydantic-settings) + AppConfig (YAML)

│ │ ├── logger.py # Logger singleton

│ │ ├── prompts.py # System prompt for the chat endpoint

│ │ └── types.py # Shared Message / Role types

│ └── api/

│ ├── v1/api.py # API v1 router aggregator

│ ├── routes/chat.py # POST /api/v1/chat — streaming response

│ ├── services/chat_service.py # ChatService — orchestrates LLM calls

│ └── clients/

│ ├── base.py # Abstract LLMClient interface

│ ├── factory.py # Selects client from config.yaml provider

│ ├── openrouter_client.py # OpenAI-SDK client -> OpenRouter

│ └── ollama_client.py # Ollama SDK client (local)

└── frontend/

├── vite.config.ts # Vite + TanStack Router + Tailwind plugins

├── package.json

└── src/

├── routes/

│ ├── index.tsx # Redirects / -> /codeflow

│ ├── chat/index.tsx # LLM chat interface

│ ├── codeflow.tsx # Codeflow layout wrapper

│ ├── codeflow/index.tsx # JSON upload / paste screen

│ └── codeflow/visualization.tsx # Interactive call graph view

├── components/ui/ # shadcn/ui + custom components

└── lib/api/chat.ts # Streaming fetch helper (chatApi.stream)

```

## Getting Started

**Detected package managers:** `uv` (backend) · `npm` (frontend)

### Prerequisites

**macOS**

```bash

# Python 3.13 via Homebrew

brew  install  python@3.13



# uv

brew  install  uv



# Node.js (LTS)

brew  install  node



# Optional: Ollama for local inference

brew  install  ollama

```

**Windows**

```powershell

# Python 3.13

winget install Python.Python.3.13



# uv

winget install astral-sh.uv



# Node.js (LTS)

winget install OpenJS.NodeJS.LTS



# Optional: Ollama

winget install Ollama.Ollama

```

### Installation

```bash

# Clone the repository

git  clone  <repo-url>

cd  llm-app



# Backend

cd  backend

uv  sync



# Frontend

cd  ../frontend

npm  install

```

### Environment Variables

**Backend** — create `backend/.env`:

| Variable | Required | Description |

| --------------------- | -------- | ------------------------------------------------------------- |

| `OPENROUTER_BASE_URL` | Yes\* | OpenRouter API base URL (e.g. `https://openrouter.ai/api/v1`) |

| `OPENROUTER_API_KEY` | Yes\* | Your OpenRouter API key |

\*Required only when `provider: openrouter` is set in `config.yaml`. Not needed for the `ollama` provider.

```ini

# backend/.env

OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

OPENROUTER_API_KEY=sk-or-...

```

**Frontend** — create `frontend/.env.local`:

| Variable | Required | Description |

| -------------- | -------- | ---------------- |

| `VITE_API_URL` | Yes | Backend base URL |

```ini

# frontend/.env.local

VITE_API_URL=http://localhost:8000

```

### Configuration

Edit `backend/config.yaml` to switch providers, models, and generation parameters:

```yaml

app:

debug: true

environment: development

provider: ollama  # "openrouter" or "ollama"



model:

max_tokens: 1000

temperature: 0.7



providers:

openrouter:

model_name: arcee-ai/trinity-large-preview:free

ollama:

model_name: qwen3.5:9b

```

## Running the Project

Open two terminals.

**Backend** (from `backend/`)

```bash

uv  run  fastapi  dev  main.py

# Starts on http://localhost:8000

```

**Frontend** (from `frontend/`)

```bash

npm  run  dev

# Starts on http://localhost:3000

```

Navigate to `http://localhost:3000` — the app redirects to `/codeflow` by default. The chat interface is at `/chat`.

> **Windows note:** Activate the virtual environment in bash with `source backend/.venv/Scripts/activate`, or use `uv run` directly without activating.

## Architecture Overview

```

Browser (React)

|

| POST /api/v1/chat (streaming plain text)

v

FastAPI (main.py)

|

+-- ChatService

|

+-- OpenRouterClient --> OpenRouter API (remote)

+-- OllamaClient --> Ollama (local)

```

The active provider is controlled by `config.yaml`. The `LLMClient` abstract base class defines the `stream_completion` interface; `ClientFactory` resolves the correct implementation at startup. The `/chat` route returns a `StreamingResponse` and checks for client disconnection on each chunk to abort early.

The frontend uses a native `fetch` streaming loop (`chatApi.stream`) to consume chunks and append them to the assistant message in real time. An `AbortController` allows in-flight generation to be cancelled.

## API Reference

All endpoints are under the FastAPI server (`http://localhost:8000`).

| Method | Path | Description |

| ------ | -------------- | ------------------ |

| `GET` | `/` | Health check |

| `POST` | `/api/v1/chat` | Streaming LLM chat |

### POST `/api/v1/chat`

**Request body** — JSON array of `Message` objects:

```json
[{ "id": "uuid", "role": "user", "content": "Hello!" }]
```

**Response** — `text/plain` stream of content chunks.

**Response headers:**

| Header | Description |

| -------------- | ---------------------------------------------- |

| `X-Model-Name` | The model used for the response |

| `X-Provider` | The active provider (`openrouter` or `ollama`) |

## Scripts

### Backend (run from `backend/`)

| Command | Description |

| ---------------------------- | ---------------------------------------- |

| `uv sync` | Install dependencies |

| `uv run fastapi dev main.py` | Start development server with hot reload |

### Frontend (run from `frontend/`)

| Command | Description |

| ----------------- | -------------------------------------- |

| `npm run dev` | Start dev server on port 3000 |

| `npm run build` | Production build |

| `npm run preview` | Preview production build locally |

| `npm run test` | Run Vitest tests |

| `npm run lint` | ESLint check |

| `npm run format` | Prettier check |

| `npm run check` | Prettier write + ESLint fix (combined) |

## Features

### Chat (`/chat`)

- Real-time streaming responses from OpenRouter or Ollama

- Full conversation history sent on each request

- Abort generation mid-stream

- File attachment UI

- Markdown rendering with syntax-highlighted code blocks

### Codeflow (`/codeflow`)

An interactive call graph visualizer. Upload or paste a JSON file describing function call relationships to explore your codebase visually.

**Input format:**

```json
{
  "nodes": [{ "id": "fn_name", "label": "fn_name", "type": "function", "file": "path/to/file.py" }],

  "edges": [{ "source": "caller", "target": "callee" }]
}
```

**Features:**

- Dagre-layout directed graph rendered by Cytoscape.js

- Sidebar with node search, type filtering, and directory filtering

- Dead code detection (nodes with no incoming edges)

- Node detail panel with metadata

- Drag-and-drop JSON file upload

- Session storage persists graph across page refreshes

# LLM Playground

A collection of LLM-powered tools built with a Python FastAPI backend and React/TypeScript frontend.

---

## Tech Stack

| Layer | Tech |
| --------- | ----------------------------------------- |
| Backend | Python, FastAPI, uv |
| Frontend | React, TypeScript, Vite, TanStack Router |
| Streaming | OpenRouter API / Ollama (local) |
| Graph | Cytoscape.js, Dagre layout |
| Styling | Tailwind CSS, shadcn/ui |

---

## Project Structure
```
llm-app/
├── backend/
│   ├── main.py                     # FastAPI entry point
│   ├── config.yaml                 # Model, provider, and app settings
│   └── app/
│       ├── core/                   # Config, logger, prompts, types
│       └── api/v1/
│           ├── routes/chat.py      # POST /api/v1/chat
│           ├── services/           # ChatService
│           └── clients/            # LLMClient, OpenRouter, Ollama
└── frontend/
    └── src/
        ├── routes/
        │   ├── chat/               # Chat interface
        │   └── codeflow/           # Upload screen + graph view
        ├── components/ui/          # shadcn/ui + custom components
        └── lib/api/chat.ts         # Streaming fetch helper
```

---

## Getting Started

**Package managers:** `uv` (backend) · `npm` (frontend)

### Prerequisites

**macOS**
```bash
brew install python@3.13 uv node
brew install ollama   # optional, for local inference
```

**Windows**
```powershell
winget install Python.Python.3.13 astral-sh.uv OpenJS.NodeJS.LTS
winget install Ollama.Ollama   # optional, for local inference
```

### Installation
```bash
git clone <repo-url>
cd llm-app

# Backend
cd backend && uv sync

# Frontend
cd ../frontend && npm install
```

---

## Environment Variables

**Backend** — create `backend/.env`

| Variable | Required | Description |
| --------------------- | -------- | --------------------------------- |
| `OPENROUTER_BASE_URL` | Yes* | OpenRouter API base URL |
| `OPENROUTER_API_KEY` | Yes* | Your OpenRouter API key |

*Only required when `provider: openrouter` is set in `config.yaml`.

**Frontend** — create `frontend/.env.local`

| Variable | Required | Description |
| -------------- | -------- | ---------------- |
| `VITE_API_URL` | Yes | Backend base URL |

---

## Configuration

Edit `backend/config.yaml` to switch providers and models:
```yaml
provider: ollama   # "openrouter" or "ollama"

model:
  max_tokens: 1000
  temperature: 0.7

providers:
  openrouter:
    model_name: arcee-ai/trinity-large-preview:free
  ollama:
    model_name: qwen3.5:9b
```

---

## Running the Project

**Backend** (from `backend/`)
```bash
uv run fastapi dev main.py
# http://localhost:8000
```

**Frontend** (from `frontend/`)
```bash
npm run dev
# http://localhost:3000
```

> **Windows:** Use `uv run` directly or activate the venv with `source backend/.venv/Scripts/activate` in bash.

---

## API Reference

| Method | Path | Description |
| ------ | -------------- | ------------------ |
| `GET` | `/` | Health check |
| `POST` | `/api/v1/chat` | Streaming LLM chat |

### POST `/api/v1/chat`

**Request** — JSON array of messages:
```json
[{ "id": "uuid", "role": "user", "content": "Hello!" }]
```

**Response** — `text/plain` stream of content chunks.

| Header | Description |
| -------------- | ----------------------------------------------- |
| `X-Model-Name` | Model used for the response |
| `X-Provider` | Active provider (`openrouter` or `ollama`) |

---

## Scripts

**Backend** (from `backend/`)

| Command | Description |
| ---------------------------- | ---------------------------------------- |
| `uv sync` | Install dependencies |
| `uv run fastapi dev main.py` | Start dev server with hot reload |

**Frontend** (from `frontend/`)

| Command | Description |
| ----------------- | --------------------------------------- |
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run check` | Prettier write + ESLint fix (combined) |

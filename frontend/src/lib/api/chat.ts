import { apiStream } from './client'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export const chatApi = {
  stream: (
    message: Message[],
    onChunk: (chunk: string) => void,
    onMeta?: (meta: { modelName: string }) => void,
    signal?: AbortSignal,
  ) =>
    apiStream(
      '/api/v1/chat',
      {
        method: 'POST',
        body: JSON.stringify(message),
      },
      onMeta,
      onChunk,
      signal,
    ),
}

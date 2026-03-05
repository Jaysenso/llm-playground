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
    onDone?: () => void,
    onError?: () => void,
  ) =>
    apiStream(
      '/api/v1/chat',
      {
        method: 'POST',
        body: JSON.stringify(message),
      },
      onChunk,
      onDone,
      onError,
    ),
}

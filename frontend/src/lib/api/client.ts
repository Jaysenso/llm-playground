const BASE_URL = import.meta.env.VITE_API_URL

export async function apiStream(
  endpoint: string,
  options?: RequestInit,
  onChunk?: (chunk: string) => void,
  onDone?: () => void,
  onError?: (err: Error) => void,
) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    if (!response.ok) throw new Error(await response.text())

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No response body')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      onChunk?.(decoder.decode(value))
    }

    onDone?.()
  } catch (err) {
    console.error(`apiStream failed [${endpoint}]:`, err)
    onError?.(err instanceof Error ? err : new Error(String(err)))
  }
}

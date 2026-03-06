const BASE_URL = import.meta.env.VITE_API_URL

export async function apiStream(
  endpoint: string,
  options?: RequestInit,
  onMeta?: (meta: { modelName: string }) => void,
  onChunk?: (chunk: string) => void,
  signal?: AbortSignal,
) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal,
      ...options,
    })
    const modelName = response.headers.get('x-model-name')
    if (modelName) onMeta?.({ modelName })

    if (!response.ok) throw new Error(await response.text())

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No response body')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      onChunk?.(decoder.decode(value))
    }
  } catch (err) {
    console.error(`apiStream failed [${endpoint}]:`, err)
  }
}

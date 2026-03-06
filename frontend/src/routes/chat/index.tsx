import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState, useCallback } from 'react'
import { ArrowUp, Paperclip, Square, X } from 'lucide-react'
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input'
import {
  ChatContainerContent,
  ChatContainerRoot,
} from '@/components/ui/chat-container'
import { ScrollButton } from '@/components/ui/scroll-button'
import { chatApi } from '#/lib/api/chat'
import { Button } from '@/components/ui/button'
import {
  WelcomeScreen,
  Header,
  AssistantMessage,
  UserMessage,
} from './_components'
import type { Message } from '@/types'

export const Route = createFileRoute('/chat/')({
  component: Chat,
})

/* ── Main Chat component ────────────────────────────────── */
function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [modelName, setModelName] = useState<string>('')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleSubmit = useCallback(async () => {
    if (isLoading) {
      abortRef.current?.abort()
      setIsLoading(false)
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
      )
      return
    }

    const trimmed = input.trim()
    if (!trimmed && files.length === 0) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }
    const assistantId = crypto.randomUUID()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    const updatedMessages = [...messages, userMsg]

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setFiles([])
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await chatApi.stream(
        updatedMessages,
        (chunk) =>
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          ),
        ({ modelName }) => setModelName(modelName),
        controller.signal,
      )
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    'Something went wrong — please make sure the backend is running on port 8000.',
                  isStreaming: false,
                }
              : m,
          ),
        )
      }
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
      )
      setIsLoading(false)
    }
  }, [input, files, isLoading])

  const abortGeneration = () => {
    abortRef.current?.abort()
    const lastUserMessage =
      messages.findLast((m) => m.role === 'user')?.content ?? ''
    setInput(lastUserMessage)
  }
  const handleNewChat = () => {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setFiles([])
    setIsLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = ''
    }
  }

  const canSend = input.trim().length > 0 || files.length > 0

  return (
    <div className="flex flex-col h-screen bg-(--chat-bg) font-body">
      {/* ── Header ── */}
      <Header handleNewChat={handleNewChat} />

      {/* ── Messages area ── */}
      {messages.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <WelcomeScreen onSuggestion={setInput} />
        </div>
      ) : (
        <ChatContainerRoot className="flex-1 min-h-0 relative">
          <ChatContainerContent className="space-y-4 p-4">
            <div className="max-w-240 mx-auto w-full px-6 pt-10 pb-4">
              {messages.map((msg) =>
                msg.role === 'user' ? (
                  <UserMessage key={msg.id} content={msg.content} />
                ) : (
                  <AssistantMessage
                    key={msg.id}
                    modelName={modelName}
                    content={msg.content}
                    isStreaming={msg.isStreaming}
                  />
                ),
              )}
            </div>
          </ChatContainerContent>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <ScrollButton className="shadow-lg bg-background dark:bg-muted" />
          </div>
        </ChatContainerRoot>
      )}

      {/* ── Input area ── */}
      <div className="shrink-0 px-4 pb-4 pt-2 max-w-178 mx-auto w-full">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full bg-(--chat-input-bg) rounded-2xl"
        >
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Paperclip className="size-4" />
                  <span className="max-w-30 truncate">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="hover:bg-secondary/50 rounded-full p-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <PromptInputTextarea placeholder="Ask me anything..." />

          <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
            <PromptInputAction tooltip="Attach files">
              <label
                htmlFor="file-upload"
                className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Paperclip className="text-primary size-5" />
              </label>
            </PromptInputAction>

            <PromptInputAction
              tooltip={isLoading ? 'Stop generation' : 'Send message'}
            >
              {/* ── Send Message & Abort Generation Button ── */}
              {isLoading ? (
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={abortGeneration}
                >
                  <Square className="size-3 fill-current" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSubmit}
                  disabled={!canSend}
                >
                  <ArrowUp className="size-4" strokeWidth={4} />
                </Button>
              )}
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        {/* ── Footer Message ── */}
        <p className="text-center text-[11px] text-(--chat-muted) font-body mt-2 opacity-65">
          LLM can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}

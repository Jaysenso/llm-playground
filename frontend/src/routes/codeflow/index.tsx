import { createFileRoute } from '@tanstack/react-router'
import { DEMO_DATA } from './_lib/constants'
import { UploadScreen } from './_components/upload-screen'
import { useCodeflowContext } from './_lib/context'

export const Route = createFileRoute('/codeflow/')({
  component: CodeflowUpload,
})

function CodeflowUpload() {
  const { state, loadData, showError, copyPrompt } = useCodeflowContext()

  const { isDragging, setIsDragging, pasteJson, setPasteJson, copied } = state

  const handleFileDrop = (file: File) => {
    const r = new FileReader()
    r.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!data.nodes || !data.edges)
          throw new Error('"nodes" and "edges" required')
        loadData(data)
      } catch (err) {
        showError('Invalid JSON: ' + (err as Error).message)
      }
    }
    r.readAsText(file)
  }

  const handleVisualize = () => {
    try {
      const data = JSON.parse(pasteJson.trim())
      if (!data.nodes || !data.edges)
        throw new Error('"nodes" and "edges" required')
      loadData(data)
    } catch (err) {
      showError('Invalid JSON: ' + (err as Error).message)
    }
  }

  return (
    <div
      className="flex-1 relative overflow-hidden"
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const f = e.dataTransfer.files[0]
        if (f) handleFileDrop(f)
      }}
    >
      <UploadScreen
        isDragging={isDragging}
        copied={copied}
        pasteJson={pasteJson}
        onLoadDemo={() => loadData(DEMO_DATA)}
        onCopyPrompt={copyPrompt}
        onFileChange={handleFileDrop}
        onPasteChange={setPasteJson}
        onVisualize={handleVisualize}
      />
    </div>
  )
}

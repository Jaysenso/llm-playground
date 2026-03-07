import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Maximize2,
  Focus,
  RotateCcw,
  Sun,
  Upload,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCodeflowContext } from '../_lib/context'
import { cn } from 'lib/util'

export function Header() {
  const { state, handleReset, handleBackToUpload, clearDetail } =
    useCodeflowContext()
  const {
    loaded,
    cyRef,
    focusMode,
    whiteBg,
    confirmAction,
    setFocusMode,
    setWhiteBg,
    setConfirmAction,
    setHelpOpen,
  } = state

  return (
    <div>
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3 border-b border-(--chat-border) shrink-0 bg-(--chat-bg)">
        <Link
          to="/chat"
          className="flex items-center gap-1.5 text-(--chat-muted) hover:text-(--chat-text) transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Chat
        </Link>

        <div className="w-px h-4 bg-(--chat-border)" />
        <span className="font-semibold text-sm">Codeflow</span>

        {loaded && (
          <>
            <div className="flex-1" />

            <Button
              size="sm"
              variant="ghost"
              className="text-(--chat-muted) hover:text-(--chat-text) text-xs h-7"
              onClick={() => cyRef.current?.fit(undefined, 100)}
            >
              <Maximize2 size={13} /> Fit
            </Button>

            <Button
              size="sm"
              variant={focusMode ? 'default' : 'ghost'}
              className={cn(
                'text-xs h-7',
                !focusMode && 'text-(--chat-muted) hover:text-(--chat-text)',
              )}
              onClick={() => {
                setFocusMode((f) => !f)
                if (focusMode) clearDetail()
              }}
            >
              <Focus size={13} /> Focus
            </Button>

            <Button
              size="sm"
              variant={whiteBg ? 'default' : 'ghost'}
              className={cn(
                'text-xs h-7',
                !whiteBg && 'text-(--chat-muted) hover:text-(--chat-text)',
              )}
              onClick={() => setWhiteBg((v) => !v)}
            >
              <Sun size={13} /> Light
            </Button>

            {confirmAction === 'reset' ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-white pr-1">
                  Reset layout?
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-semibold h-7 text-red-400 hover:text-red-300 px-2"
                  onClick={() => {
                    handleReset()
                    setConfirmAction(null)
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-semibold h-7 text-(--chat-muted) hover:text-(--chat-text) px-2"
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-(--chat-muted) hover:text-(--chat-text) text-xs h-7"
                onClick={() => setConfirmAction('reset')}
              >
                <RotateCcw size={13} /> Reset
              </Button>
            )}

            <div className="w-px h-4 bg-(--chat-border)" />

            {confirmAction === 'newfile' ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-white pr-1">
                  Leave graph?
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-semibold h-7 text-red-400 hover:text-red-300 px-2"
                  onClick={() => {
                    handleBackToUpload()
                    setConfirmAction(null)
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-semibold h-7 text-(--chat-muted) hover:text-(--chat-text) px-2"
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-(--chat-muted) hover:text-(--chat-text) text-xs h-7"
                onClick={() => setConfirmAction('newfile')}
              >
                <Upload size={13} /> New file
              </Button>
            )}
          </>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="text-(--chat-muted) hover:text-(--chat-text) h-7 w-7 p-0 ml-auto"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle size={15} />
        </Button>
      </header>
    </div>
  )
}

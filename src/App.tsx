import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, nextMarkerNumber } from './store/useStore'
import { t } from './utils/i18n'
import type { AnyElement } from './utils/types'
import LeftToolbar from './components/LeftToolbar'
import RightPanel from './components/RightPanel'
import Topbar from './components/Topbar'
import OrganCanvas from './components/OrganCanvas'
import Legend from './components/Legend'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const lang = useStore(s => s.get().settings.lang)
  const state = useStore(s => s.get())
  const setPresent = useStore(s => s.setPresentState)
  const loadFromURL = useStore(s => s.loadFromURL)

  useKeyboardShortcuts()

  useEffect(() => {
    loadFromURL()
  }, [loadFromURL])

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar />
        <main className="flex-1 flex flex-col gap-2 p-2">
          <div className="flex-1 card overflow-hidden relative">
            <OrganCanvas />
            <div className="absolute bottom-2 right-2"><Legend /></div>
          </div>
        </main>
        <RightPanel />
      </div>
      <footer className="text-center text-xs text-slate-500 p-2">
        {t(lang, 'qrInfo')}
      </footer>
    </div>
  )
}

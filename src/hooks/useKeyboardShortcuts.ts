import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useKeyboardShortcuts() {
  const undo = useStore(s => s.undo)
  const redo = useStore(s => s.redo)
  const deleteElement = useStore(s => s.deleteElement)
  const selectedId = useStore(s => s.get().selectedId)
  const duplicate = useStore(s => s.duplicateElement)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); undo() }
      if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo() }
      if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); if (selectedId) duplicate(selectedId) }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedId) deleteElement(selectedId) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, selectedId, deleteElement, duplicate])
}

import { create } from 'zustand'
import { createHistory, setPresent, undo as hUndo, redo as hRedo } from './history'
import type { AnyElement, RootState, UUID } from '../utils/types'
import { decodeState } from '../utils/encoding'

const initialState: RootState = {
  version: '1.0.0',
  caseMeta: {
    caseId: crypto.randomUUID(),
    date: new Date().toISOString().slice(0,10),
    patientId: '',
    surgeon: '',
    notes: '',
    team: '',
    procedure: '',
    diagnoses: '',
    asa: '',
    anesthesia: '',
    remarks: ''
  },
  canvas: {
    width: 2000, height: 1400, background: '#ffffff',
    organs: { bowel: {visible: true}, pancreas: {visible: true}, liver: {visible: true}, gallbladder: {visible: true}, spleen: {visible: true} }
  },
  elements: [],
  selectedId: undefined,
  settings: {
    snapping: true,
    grid: true,
    unit: 'px',
    lang: 'de',
    showOrgans: {bowel: true, pancreas: true, liver: true, gallbladder: true, spleen: true}
  }
}

type Store = {
  history: ReturnType<typeof createHistory<RootState>>
  get: () => RootState
  setPresentState: (next: RootState) => void
  addElement: (el: AnyElement) => void
  updateElement: (id: UUID, patch: Partial<AnyElement>) => void
  deleteElement: (id: UUID) => void
  duplicateElement: (id: UUID) => void
  reorderMarkers: (orderedIds: UUID[]) => void
  select: (id?: UUID) => void
  undo: () => void
  redo: () => void
  newCase: () => void
  loadFromJSON: (json: string) => void
  loadFromURL: () => void
}

export const useStore = create<Store>((set, getAll) => {
  const hist = createHistory<RootState>(initialState)
  return {
    history: hist,
    get: () => getAll().history.present,
    setPresentState: (next) => set((s) => ({ history: setPresent(s.history, next) })),
    addElement: (el) => set((s) => {
      const next = structuredClone(s.history.present)
      next.elements.push(el)
      next.selectedId = el.id
      return { history: setPresent(s.history, next) }
    }),
    updateElement: (id, patch) => set((s) => {
      const next = structuredClone(s.history.present)
      const idx = next.elements.findIndex((e) => e.id === id)
      if (idx >= 0) next.elements[idx] = { ...next.elements[idx], ...patch } as AnyElement
      return { history: setPresent(s.history, next) }
    }),
    deleteElement: (id) => set((s) => {
      const next = structuredClone(s.history.present)
      next.elements = next.elements.filter((e) => e.id !== id)
      if (next.selectedId === id) next.selectedId = undefined
      // Re-index markers
      next.elements = next.elements
        .sort((a,b) => a.markerNumber - b.markerNumber)
        .map((e, i) => ({...e, markerNumber: i+1} as AnyElement))
      return { history: setPresent(s.history, next) }
    }),
    duplicateElement: (id) => set((s) => {
      const next = structuredClone(s.history.present)
      const el = next.elements.find((e) => e.id === id)
      if (el) {
        const copy = structuredClone(el)
        ;(copy as AnyElement).id = crypto.randomUUID()
        copy.markerNumber = next.elements.length + 1
        if (copy.position) copy.position.x += 20, copy.position.y += 20
        next.elements.push(copy)
        next.selectedId = copy.id
      }
      return { history: setPresent(s.history, next) }
    }),
    reorderMarkers: (orderedIds) => set((s) => {
      const next = structuredClone(s.history.present)
      const idToEl = new Map(next.elements.map(e => [e.id, e]))
      const ordered = orderedIds.map((id) => idToEl.get(id)!).filter(Boolean)
      // Keep unlisted at end
      const rest = next.elements.filter(e => !idToEl || !orderedIds.includes(e.id))
      const all = [...ordered, ...rest]
      all.forEach((e, i) => e.markerNumber = i+1)
      next.elements = all
      return { history: setPresent(s.history, next) }
    }),
    select: (id) => set((s) => ({ history: { ...s.history, present: { ...s.history.present, selectedId: id } } })),
    undo: () => set((s) => ({ history: hUndo(s.history) })),
    redo: () => set((s) => ({ history: hRedo(s.history) })),
    newCase: () => set(() => ({ history: createHistory(structuredClone(initialState)) })),
    loadFromJSON: (json: string) => set((s) => {
      const parsed = JSON.parse(json) as RootState
      // Ensure marker numbers are consistent
      parsed.elements = parsed.elements.sort((a,b) => a.markerNumber - b.markerNumber)
      return { history: setPresent(s.history, parsed) }
    }),
    loadFromURL: () => set((s) => {
      const url = new URL(window.location.href)
      const param = url.searchParams.get('state')
      if (!param) return {}
      const decoded = decodeState(param)
      if (!decoded) return {}
      return { history: setPresent(s.history, decoded) }
    })
  }
})

export function nextMarkerNumber(state: RootState): number {
  return state.elements.length + 1
}

export function saveLocal(state: RootState) {
  localStorage.setItem('opviz:last', JSON.stringify(state))
}
export function loadLocal(): RootState | null {
  const s = localStorage.getItem('opviz:last')
  return s ? JSON.parse(s) as RootState : null
}

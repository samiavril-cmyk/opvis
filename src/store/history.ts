import type { RootState } from '../utils/types'

export interface History<T> {
  past: T[]
  present: T
  future: T[]
}

export function createHistory<T>(initial: T): History<T> {
  return { past: [], present: initial, future: [] }
}

export function canUndo<T>(h: History<T>) {
  return h.past.length > 0
}
export function canRedo<T>(h: History<T>) {
  return h.future.length > 0
}

export function setPresent<T>(h: History<T>, next: T): History<T> {
  return { past: [...h.past, h.present], present: next, future: [] }
}

export function undo<T>(h: History<T>): History<T> {
  if (!canUndo(h)) return h
  const prev = h.past[h.past.length - 1]
  const past = h.past.slice(0, -1)
  return { past, present: prev, future: [h.present, ...h.future] }
}

export function redo<T>(h: History<T>): History<T> {
  if (!canRedo(h)) return h
  const next = h.future[0]
  const future = h.future.slice(1)
  return { past: [...h.past, h.present], present: next, future }
}

import { describe, it, expect } from 'vitest'
import { useStore } from '../../src/store/useStore'

describe('store basics', () => {
  it('adds and reorders markers', () => {
    const s = useStore.getState()
    const base = { id: crypto.randomUUID(), type: 'drain', subtype: 'custom', path: [[0,0]], markerNumber: 1, footnote: '' } as any
    s.addElement(base)
    const base2 = { ...base, id: crypto.randomUUID(), markerNumber: 2 }
    s.addElement(base2)
    const ids = [base2.id, base.id]
    s.reorderMarkers(ids)
    const st = s.get()
    expect(st.elements[0].markerNumber).toBe(1)
    expect(st.elements[0].id).toBe(base2.id)
  })
})

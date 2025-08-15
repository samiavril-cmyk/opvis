import { describe, it, expect } from 'vitest'
import { encodeState, decodeState } from '../../src/utils/encoding'

describe('encoding', () => {
  it('roundtrips', () => {
    const state: any = { version: '1.0.0', elements: [{ id: '1', markerNumber: 1, type: 'drain', subtype: 'custom', path: [[0,0],[1,1]] }], caseMeta: {}, canvas: { organs: { bowel: {visible: true}, pancreas: {visible: true}, liver: {visible: true}, gallbladder: {visible: true}, spleen: {visible: true} }}, settings: { snapping: true, grid: true, unit: 'px', lang: 'de', showOrgans: {bowel: true, pancreas: true, liver: true, gallbladder: true, spleen: true} } }
    const enc = encodeState(state as any)
    const dec = decodeState(enc)!
    expect(dec.elements[0].subtype).toBe('custom')
  })
})

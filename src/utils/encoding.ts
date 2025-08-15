import LZString from 'lz-string'
import type { RootState } from './types'

export function encodeState(state: RootState): string {
  const json = JSON.stringify(state)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeState(param: string): RootState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(param)
    if (!json) return null
    return JSON.parse(json) as RootState
  } catch {
    return null
  }
}

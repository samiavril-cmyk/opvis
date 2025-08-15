export type UUID = string

export type ElementType = 'anastomosis' | 'resection' | 'drain' | 'stoma'
export type AnastomosisSubtype = 'end_to_side' | 'side_to_side' | 'end_to_end' | 'hepaticojejunostomy'
export type StomaSubtype = 'stoma_end' | 'stoma_loop'
export type ResectionSubtype = 'line' | 'polygon' | 'liver_segment_resection' | 'gallbladder_removed' | 'spleen_partial'
export type DrainSubtype = 'subhepatic' | 'paracolic' | 'douglas' | 'custom'

export type OrganKey =
  | 'bowel' | 'pancreas' | 'liver' | 'gallbladder' | 'spleen'
  | 'ileum' | 'jejunum'
  | 'colon_asc' | 'colon_trans' | 'colon_desc' | 'sigmoid' | 'rectum'
  | 'liver_S1' | 'liver_S2' | 'liver_S3' | 'liver_S4' | 'liver_S5' | 'liver_S6' | 'liver_S7' | 'liver_S8'

export interface Point { x: number; y: number }

export interface BaseEl {
  id: UUID
  type: ElementType
  subtype: string
  position?: { x: number; y: number; rotation?: number; scale?: number }
  style?: { stroke?: string; strokeWidth?: number; fill?: string; dasharray?: string }
  markerNumber: number
  footnote: string
  locked?: boolean
}

export interface AnastomosisEl extends BaseEl {
  type: 'anastomosis'
  subtype: AnastomosisSubtype
  organs?: OrganKey[]
  properties?: { diameter?: string; suture?: string; layer?: 'single' | 'double'; stapler?: string; ischemia?: boolean }
}

export interface ResectionEl extends BaseEl {
  type: 'resection'
  subtype: ResectionSubtype
  organs?: OrganKey[]
  shape?: { points?: [number, number][] } // polygon
  line?: { points?: [number, number][], staple?: boolean }
  properties?: { approach?: 'offen' | 'laparoskopisch' }
}

export interface DrainEl extends BaseEl {
  type: 'drain'
  subtype: DrainSubtype
  path: [number, number][]
}

export interface StomaEl extends BaseEl {
  type: 'stoma'
  subtype: StomaSubtype
  properties?: { loop?: boolean; skinMark?: boolean }
}

export type AnyElement = AnastomosisEl | ResectionEl | DrainEl | StomaEl

export interface CaseMeta {
  caseId: UUID
  date: string
  patientId?: string
  surgeon?: string
  notes?: string
  team?: string
  procedure?: string
  diagnoses?: string
  asa?: string
  anesthesia?: string
  remarks?: string
}

export interface CanvasState {
  width: number
  height: number
  background: string
  organs: Record<'bowel' | 'pancreas' | 'liver' | 'gallbladder' | 'spleen', { visible: boolean }>
}

export interface RootState {
  version: string
  caseMeta: CaseMeta
  canvas: CanvasState
  elements: AnyElement[]
  selectedId?: UUID
  settings: {
    snapping: boolean
    grid: boolean
    unit: 'px' | 'mm'
    lang: 'de' | 'en'
    showOrgans: Record<'bowel' | 'pancreas' | 'liver' | 'gallbladder' | 'spleen', boolean>
  }
}

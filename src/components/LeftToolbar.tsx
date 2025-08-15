import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useMemo } from 'react'

const items = [
  { id: 'an_ezs', label: 'E-z-S', type: 'anastomosis', subtype: 'end_to_side' },
  { id: 'an_szs', label: 'S-z-S', type: 'anastomosis', subtype: 'side_to_side' },
  { id: 'an_eze', label: 'E-z-E', type: 'anastomosis', subtype: 'end_to_end' },
  { id: 'an_hj', label: 'Hepatico-J', type: 'anastomosis', subtype: 'hepaticojejunostomy' },
  { id: 'st_end', label: 'Stoma end', type: 'stoma', subtype: 'stoma_end' },
  { id: 'st_loop', label: 'Stoma loop', type: 'stoma', subtype: 'stoma_loop' },
  { id: 're_line', label: 'Resektion Linie', type: 'resection', subtype: 'line' },
  { id: 're_poly', label: 'Resektion Poly', type: 'resection', subtype: 'polygon' },
  { id: 're_liver', label: 'Leber Segment', type: 'resection', subtype: 'liver_segment_resection' },
  { id: 're_gb', label: 'Cholezystekt.', type: 'resection', subtype: 'gallbladder_removed' },
  { id: 'drain', label: 'Drainage', type: 'drain', subtype: 'custom' },
]

function Draggable({ id, label }: { id: string, label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = { transform: CSS.Translate.toString(transform) }
  return (
    <button ref={setNodeRef} {...listeners} {...attributes}
      className={'btn w-full justify-between ' + (isDragging ? 'opacity-50' : '')}
      style={style}>
      <span>{label}</span>
      <kbd className="text-xs text-slate-500">drag</kbd>
    </button>
  )
}

export default function LeftToolbar() {
  return (
    <aside className="w-56 p-2 flex flex-col gap-2">
      <div className="card p-2">
        <h2 className="font-semibold mb-2">Palette</h2>
        <div className="grid grid-cols-1 gap-2">
          {items.map((it) => <Draggable key={it.id} id={JSON.stringify(it)} label={it.label} />)}
        </div>
      </div>
      <div className="card p-2">
        <h2 className="font-semibold mb-1">Tools</h2>
        <div className="text-sm text-slate-600">Auswahl (V), Hand (Space)</div>
      </div>
    </aside>
  )
}

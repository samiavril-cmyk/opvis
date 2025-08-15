import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import type { AnyElement } from '../utils/types'
import { t } from '../utils/i18n'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function PropRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <div className="w-28 text-slate-600">{label}</div>
      <div className="flex-1">{children}</div>
    </label>
  )
}

function FootnoteItem({ el }: { el: AnyElement }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: el.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="flex items-start gap-2 p-2 border rounded-lg hover:bg-slate-50 cursor-grab active:cursor-grabbing">
      <div className="shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">{el.markerNumber}</div>
      <div className="text-sm leading-tight">{el.footnote || <span className="text-slate-400">—</span>}</div>
    </div>
  )
}

export default function RightPanel() {
  const get = useStore(s => s.get)
  const state = get()
  const lang = state.settings.lang
  const selectedId = state.selectedId
  const update = useStore(s => s.updateElement)
  const reorder = useStore(s => s.reorderMarkers)

  const selected = state.elements.find(e => e.id === selectedId)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function onDragEnd(event: any) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = state.elements.sort((a,b)=>a.markerNumber-b.markerNumber).map(e => e.id)
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    const next = arrayMove(ids, oldIndex, newIndex)
    reorder(next)
  }

  return (
    <aside className="w-[360px] p-2 flex flex-col gap-2">
      <div className="card p-3">
        <h2 className="font-semibold mb-2">{t(lang, 'meta')}</h2>
        <div className="space-y-2 text-sm">
          <PropRow label={t(lang,'patient')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.patientId||''} onChange={(e)=>{
            const s = get(); s.caseMeta.patientId = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'date')}><input type="date" className="w-full border rounded px-2 py-1" value={state.caseMeta.date||''} onChange={(e)=>{
            const s = get(); s.caseMeta.date = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'surgeon')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.surgeon||''} onChange={(e)=>{
            const s = get(); s.caseMeta.surgeon = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'procedure')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.procedure||''} onChange={(e)=>{
            const s = get(); s.caseMeta.procedure = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'team')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.team||''} onChange={(e)=>{
            const s = get(); s.caseMeta.team = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'diagnoses')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.diagnoses||''} onChange={(e)=>{
            const s = get(); s.caseMeta.diagnoses = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'asa')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.asa||''} onChange={(e)=>{
            const s = get(); s.caseMeta.asa = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'anesthesia')}><input className="w-full border rounded px-2 py-1" value={state.caseMeta.anesthesia||''} onChange={(e)=>{
            const s = get(); s.caseMeta.anesthesia = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
          <PropRow label={t(lang,'remarks')}><textarea className="w-full border rounded px-2 py-1" value={state.caseMeta.remarks||''} onChange={(e)=>{
            const s = get(); s.caseMeta.remarks = e.target.value; useStore.getState().setPresentState({...s})
          }}/></PropRow>
        </div>
      </div>

      <div className="card p-3">
        <h2 className="font-semibold mb-2">{t(lang,'properties')}</h2>
        {!selected && <div className="text-sm text-slate-500">Kein Element ausgewählt.</div>}
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center">{selected.markerNumber}</div>
              <input className="flex-1 border rounded px-2 py-1"
                placeholder="Fußnotentext"
                value={selected.footnote || ''}
                onChange={(e)=>useStore.getState().updateElement(selected.id, { footnote: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-600">Rotation°
                <input type="number" className="w-full border rounded px-2 py-1"
                  value={selected.position?.rotation || 0}
                  onChange={(e)=>useStore.getState().updateElement(selected.id, { position: {...(selected.position||{x:0,y:0,scale:1}), rotation: parseFloat(e.target.value)} })}
                />
              </label>
              <label className="text-xs text-slate-600">Scale
                <input type="number" step="0.1" className="w-full border rounded px-2 py-1"
                  value={selected.position?.scale || 1}
                  onChange={(e)=>useStore.getState().updateElement(selected.id, { position: {...(selected.position||{x:0,y:0,rotation:0}), scale: parseFloat(e.target.value)} })}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={()=>useStore.getState().duplicateElement(selected.id)}>Duplizieren</button>
              <button className="btn" onClick={()=>useStore.getState().deleteElement(selected.id)}>Löschen</button>
            </div>
          </div>
        )}
      </div>

      <div className="card p-3">
        <h2 className="font-semibold mb-2">{t(lang,'footnotes')}</h2>
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <SortableContext
            items={state.elements.sort((a,b)=>a.markerNumber-b.markerNumber).map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2 max-h-[30vh] overflow-auto pr-1">
              {state.elements
                .sort((a,b)=>a.markerNumber-b.markerNumber)
                .map((el) => <FootnoteItem key={el.id} el={el} />)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  )
}

import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, nextMarkerNumber } from '../store/useStore'
import type { AnyElement } from '../utils/types'
import { bowelPath, pancreasPath, liverOutline, gallbladderPath, spleenPath, liverSegments } from '../utils/organPaths'

function Marker({ n }: { n: number }) {
  return (
    <g>
      <circle r={12} fill="#0f172a" />
      <text x={0} y={4} textAnchor="middle" fontSize={12} fill="#fff" fontFamily="ui-sans-serif, system-ui">{n}</text>
    </g>
  )
}

function useSVGDrag(elId: string, x: number, y: number) {
  const [pos, setPos] = useState({x, y})
  const dragRef = useRef<SVGGElement>(null)
  useEffect(()=>{ setPos({x, y}) }, [x, y])
  useEffect(() => {
    const el = dragRef.current
    if (!el) return
    let ox = 0, oy = 0, dragging = false
    function onDown(e: MouseEvent) { dragging = true; ox = e.clientX - pos.x; oy = e.clientY - pos.y }
    function onMove(e: MouseEvent) { if (!dragging) return; setPos({x: e.clientX - ox, y: e.clientY - oy}) }
    function onUp() { dragging = false }
    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { el.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [pos.x, pos.y])
  return { pos, dragRef }
}

export default function OrganCanvas() {
  const add = useStore(s => s.addElement)
  const state = useStore(s => s.get())
  const select = useStore(s => s.select)
  const update = useStore(s => s.updateElement)

  const droppable = useDroppable({ id: 'canvas' })
  const svgRef = useRef<SVGSVGElement>(null)

  function canvasPoint(e: React.MouseEvent) {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    const sp = pt.matrixTransform(ctm.inverse())
    return { x: sp.x, y: sp.y }
  }

  function onDrop(event: DragEndEvent) {
    const dataStr = event.active.id as string
    let payload: any
    try { payload = JSON.parse(dataStr) } catch { return }
    const { x, y } = { x: state.canvas.width/2, y: state.canvas.height/2 }
    const markerNumber = nextMarkerNumber(state)
    const id = crypto.randomUUID()
    const base = { id, markerNumber, footnote: '', position: {x, y, rotation: 0, scale: 1} }
    if (payload.type === 'anastomosis') {
      add({ ...base, type: 'anastomosis', subtype: payload.subtype, style: { stroke: '#1f4ed8', strokeWidth: 3 } } as AnyElement)
    } else if (payload.type === 'stoma') {
      add({ ...base, type: 'stoma', subtype: payload.subtype, style: { stroke: '#f59e0b', strokeWidth: 3 } } as AnyElement)
    } else if (payload.type === 'resection') {
      if (payload.subtype === 'liver_segment_resection') {
        add({ ...base, type: 'resection', subtype: payload.subtype, style: { stroke: '#dc2626', strokeWidth: 2, fill: 'rgba(220,38,38,0.25)' } } as AnyElement)
      } else {
        add({ ...base, type: 'resection', subtype: payload.subtype, style: { stroke: '#dc2626', strokeWidth: 2 } } as AnyElement)
      }
    } else if (payload.type === 'drain') {
      add({ ...base, type: 'drain', subtype: 'custom', path: [[x-40,y-40],[x,y],[x+40,y+40]], style: { stroke: '#6b7280', strokeWidth: 2, dasharray: '6 4' } } as AnyElement)
    }
  }

  function renderElement(el: AnyElement) {
    const { x, y, rotation = 0, scale = 1 } = el.position || { x: 0, y: 0, rotation: 0, scale: 1 }
    const sel = state.selectedId === el.id
    const common = { transform: `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`, cursor: el.locked ? 'not-allowed' : 'move' } as any

    function onMouseDown(e: any) {
      e.stopPropagation()
      select(el.id)
    }

    function drag(e: React.MouseEvent) {
      if (el.locked) return
      if (e.buttons !== 1) return
      const svg = svgRef.current!
      const pt = svg.createSVGPoint()
      pt.x = e.clientX; pt.y = e.clientY
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const sp = pt.matrixTransform(ctm.inverse())
      useStore.getState().updateElement(el.id, { position: { ...el.position!, x: sp.x, y: sp.y } })
    }

    if (el.type === 'anastomosis') {
      return (
        <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
          <g>
            <path d="M -30 0 L 30 0" stroke={el.style?.stroke || '#1f4ed8'} strokeWidth={el.style?.strokeWidth||3} />
            <path d="M 0 -20 L 0 20" stroke={el.style?.stroke || '#1f4ed8'} strokeWidth={el.style?.strokeWidth||3} />
            {el.subtype === 'hepaticojejunostomy' && <circle cx="0" cy="0" r="10" fill="none" stroke={el.style?.stroke || '#1f4ed8'} strokeWidth={el.style?.strokeWidth||3} />}
          </g>
          <g transform="translate(36, -24)"><Marker n={el.markerNumber} /></g>
        </g>
      )
    }
    if (el.type === 'stoma') {
      return (
        <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
          <circle r="18" fill="none" stroke={el.style?.stroke || '#f59e0b'} strokeWidth={el.style?.strokeWidth||3} />
          <rect x="-12" y="-6" width="24" height="12" fill="#f59e0b" opacity="0.4" />
          <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
        </g>
      )
    }
    if (el.type === 'resection') {
      if (el.subtype === 'liver_segment_resection') {
        return (
          <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
            <polygon points="-40,-20 -10,-10 -20,20" fill={el.style?.fill || 'rgba(220,38,38,0.25)'} stroke={el.style?.stroke || '#dc2626'} strokeWidth={el.style?.strokeWidth||2} />
            <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
          </g>
        )
      }
      if (el.subtype === 'polygon') {
        return (
          <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
            <polygon points="-40,-20 10,-10 0,20" fill="none" stroke={el.style?.stroke || '#dc2626'} strokeWidth={el.style?.strokeWidth||2} />
            <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
          </g>
        )
      }
      if (el.subtype === 'line') {
        return (
          <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
            <path d="M -40 0 L 40 0" stroke={el.style?.stroke || '#dc2626'} strokeWidth={el.style?.strokeWidth||2} strokeDasharray="6 4" />
            <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
          </g>
        )
      }
      if (el.subtype === 'gallbladder_removed') {
        return (
          <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
            <rect x="-20" y="-10" width="40" height="20" fill="none" stroke={el.style?.stroke || '#dc2626'} strokeWidth={el.style?.strokeWidth||2} />
            <path d="M -20 -10 L 20 10 M -20 10 L 20 -10" stroke={el.style?.stroke || '#dc2626'} strokeWidth={el.style?.strokeWidth||2} />
            <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
          </g>
        )
      }
    }
    if (el.type === 'drain') {
      const d = 'M ' + el.path.map(p => p.join(' ')).join(' L ')
      return (
        <g key={el.id} onMouseDown={onMouseDown} onMouseMove={drag} {...common}>
          <path d={d} fill="none" stroke={el.style?.stroke || '#6b7280'} strokeWidth={el.style?.strokeWidth||2} strokeDasharray={el.style?.dasharray || '6 4'} markerEnd="url(#arrow)" />
          <g transform="translate(24, -24)"><Marker n={el.markerNumber} /></g>
        </g>
      )
    }
    return null
  }

  return (
    <DndContext onDragEnd={onDrop}>
      <div className="w-full h-full overflow-auto">
        <svg id="organ-svg" ref={svgRef} width="2000" height="1400" viewBox="0 0 2000 1400" role="img" aria-label="Organ Canvas">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#6b7280" />
            </marker>
          </defs>
          <rect x="0" y="0" width="2000" height="1400" fill="#fff" />
          {state.canvas.organs.bowel.visible && (
            <g opacity="0.25">
              <path d={bowelPath} fill="none" stroke="#0ea5e9" strokeWidth="3" />
            </g>
          )}
          {state.canvas.organs.pancreas.visible && (
            <g opacity="0.25">
              <path d={pancreasPath} fill="none" stroke="#d97706" strokeWidth="3" />
            </g>
          )}
          {state.canvas.organs.liver.visible && (
            <g opacity="0.25">
              <path d={liverOutline} fill="#fca5a5" stroke="#ef4444" strokeWidth="1" opacity="0.35" />
              {liverSegments.map(seg => <path key={seg.key} d={seg.path} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />)}
            </g>
          )}
          {state.canvas.organs.gallbladder.visible && (
            <g opacity="0.25">
              <path d={gallbladderPath} fill="#10b981" stroke="#065f46" />
            </g>
          )}
          {state.canvas.organs.spleen.visible && (
            <g opacity="0.25">
              <path d={spleenPath} fill="#a78bfa" stroke="#6d28d9" />
            </g>
          )}

          {state.elements.sort((a,b)=>a.markerNumber-b.markerNumber).map(renderElement)}
        </svg>
      </div>
    </DndContext>
  )
}

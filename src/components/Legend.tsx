export default function Legend() {
  const items = [
    { color: 'bg-anastomosis', label: 'Anastomosen' },
    { color: 'bg-resection', label: 'Resektionen' },
    { color: 'bg-drai', label: 'Drainagen', style: { background: '#6b7280' } },
    { color: 'bg-stoma', label: 'Stoma' },
    { color: '', label: 'Lebersegmente', style: { background: 'rgba(220,38,38,0.25)', border: '1px solid #dc2626' } },
  ]
  return (
    <div className="card px-3 py-2 text-xs">
      <div className="font-semibold mb-1">Legende</div>
      <div className="flex gap-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border border-slate-300" style={it.style}></span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

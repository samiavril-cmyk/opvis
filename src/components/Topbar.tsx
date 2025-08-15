import { useState } from 'react'
import { useStore } from '../store/useStore'
import { encodeState } from '../utils/encoding'
import { exportPNG, exportPDF, downloadBlob } from '../utils/export'
import QRCode from 'qrcode.react'
import { t } from '../utils/i18n'

export default function Topbar() {
  const state = useStore(s => s.get())
  const setPresent = useStore(s => s.setPresentState)
  const newCase = useStore(s => s.newCase)
  const loadFromJSON = useStore(s => s.loadFromJSON)
  const lang = state.settings.lang

  const [qrOpen, setQrOpen] = useState(false)

  function saveLocal() {
    localStorage.setItem('opviz:last', JSON.stringify(state))
  }
  function loadLocal() {
    const s = localStorage.getItem('opviz:last')
    if (s) setPresent(JSON.parse(s))
  }
  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then(txt => loadFromJSON(txt))
  }
  function makeQRUrl() {
    const enc = encodeState(state)
    const url = new URL(window.location.href)
    url.searchParams.set('state', enc)
    return url.toString()
  }
  async function doExportPNG() {
    const svg = document.querySelector('#organ-svg') as SVGSVGElement
    if (!svg) return
    const blob = await exportPNG(svg, 300)
    downloadBlob(blob, `opviz-${state.caseMeta.caseId}.png`)
  }
  async function doExportPDF() {
    const svg = document.querySelector('#organ-svg') as SVGSVGElement
    if (!svg) return
    const doc = await exportPDF(svg, state, state.elements)
    doc.save(`opviz-${state.caseMeta.caseId}.pdf`)
  }

  return (
    <header className="p-2 flex items-center gap-2 border-b bg-white sticky top-0 z-10">
      <div className="font-semibold text-lg px-2">OP Viz Doc</div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => newCase()}>{t(lang, 'newCase')}</button>
        <button className="btn" onClick={saveLocal}>{t(lang, 'save')}</button>
        <button className="btn" onClick={loadLocal}>{t(lang, 'load')}</button>
        <label className="btn cursor-pointer">
          JSON
          <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
        </label>
      </div>

      <div className="flex gap-2 ml-auto">
        <button className="btn" onClick={doExportPNG}>{t(lang, 'exportPNG')}</button>
        <button className="btn" onClick={doExportPDF}>{t(lang, 'exportPDF')}</button>
        <button className="btn" onClick={() => setQrOpen((v)=>!v)}>{t(lang, 'qrMake')}</button>
      </div>

      {qrOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={()=>setQrOpen(false)}>
          <div className="card p-4 w-[520px] max-w-[90vw]" onClick={(e)=>e.stopPropagation()}>
            <h2 className="font-semibold mb-3">QR</h2>
            <div className="flex items-center justify-center p-4">
              <QRCode value={makeQRUrl()} size={360} includeMargin />
            </div>
            <div className="text-xs text-slate-600 break-all">{makeQRUrl()}</div>
          </div>
        </div>
      )}
    </header>
  )
}

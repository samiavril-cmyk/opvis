import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import 'svg2pdf.js'
import type { RootState, AnyElement } from './types'

function svgString(el: SVGSVGElement): string {
  const clone = el.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const css = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from((sheet as CSSStyleSheet).cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')
  const style = document.createElement('style')
  style.innerHTML = css
  clone.insertBefore(style, clone.firstChild)
  const xml = new XMLSerializer().serializeToString(clone)
  return xml
}

export async function exportPNG(svgEl: SVGSVGElement, dpi = 300): Promise<Blob> {
  // Render the SVG inside a wrapper to preserve layout via html2canvas
  const wrapper = document.createElement('div')
  wrapper.style.background = 'white'
  wrapper.style.padding = '16px'
  wrapper.appendChild(svgEl.cloneNode(true))
  const canvas = await html2canvas(wrapper, { backgroundColor: '#ffffff', scale: dpi / 96 })
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/png'))
}

export async function exportPDF(svgEl: SVGSVGElement, state: RootState, footnotes: AnyElement[]) {
  const pageW = 210 // A4 mm
  const pageH = 297
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const margin = 12

  // Header metadata
  const y0 = margin
  doc.setFontSize(12)
  doc.text('OP Viz Doc — Visual OP-Dokumentation', margin, y0)
  doc.setFontSize(9)

  const metaLines = [
    `Patient: ${state.caseMeta.patientId || ''}`,
    `Datum: ${state.caseMeta.date || ''}`,
    `Eingriff: ${state.caseMeta.procedure || ''}`,
    `Team: ${state.caseMeta.team || ''}`,
    `ASA: ${state.caseMeta.asa || ''}  Anästhesie: ${state.caseMeta.anesthesia || ''}`,
  ]
  metaLines.forEach((line, i) => doc.text(line, margin, y0 + 6 + i * 5))

  // SVG to PDF
  const availableH = pageH - margin * 2 - 40
  const availableW = pageW - margin * 2

  const svgXml = svgString(svgEl)
  // @ts-ignore augment typings for svg2pdf
  const svgElTemp = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgElTemp.innerHTML = svgXml

  // Compute scale to fit
  const vb = svgEl.viewBox.baseVal
  const w = vb && vb.width ? vb.width : svgEl.clientWidth
  const h = vb && vb.height ? vb.height : svgEl.clientHeight
  const scale = Math.min(availableW / w, availableH / h)
  const left = margin + (availableW - w * scale) / 2
  const top = y0 + 32

  // @ts-ignore
  await (doc as any).svg(svgEl, { x: left, y: top, width: w * scale, height: h * scale })

  // Footnotes
  let fy = top + h * scale + 8
  const footTitle = 'Fußnoten / Notes'
  doc.setFontSize(11)
  doc.text(footTitle, margin, fy)
  doc.setFontSize(9)
  fy += 5
  const lineH = 5
  let page = 1
  footnotes
    .sort((a, b) => a.markerNumber - b.markerNumber)
    .forEach((el) => {
      const text = `${el.markerNumber}. ${el.footnote || ''}`.trim()
      const split = doc.splitTextToSize(text, pageW - margin * 2)
      split.forEach((ln) => {
        if (fy > pageH - margin) {
          doc.addPage('a4', 'portrait')
          page++
          fy = margin
        }
        doc.text(ln, margin, fy)
        fy += lineH
      })
    })

  return doc
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

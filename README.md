# OP Viz Doc — Visuelle OP‑Dokumentation (Rein Clientseitig)

**Stack:** React 18 + TypeScript + Vite · Tailwind CSS · Zustand · @dnd-kit/core · SVG · `lz-string` · `qrcode.react` · Export via `html2canvas` (PNG) und `jspdf` + `svg2pdf.js` (PDF) · Optional PWA

**Ziel:** Schnelle, standardisierte, visuelle OP‑Skizzen mit nummerierten Markern (Fußnoten), QR‑Code‑Workflow und Export als PNG/PDF. *Keine Server‑Komponenten.*

## Quickstart

```bash
npm ci
npm run dev
# open http://localhost:5173
```

## Build & GitHub Pages

Dieses Projekt ist für **GitHub Pages** vorbereitet. Der Vite‑Build schreibt in `/docs`.
Der mitgelieferte Workflow (`.github/workflows/gh-pages.yml`) baut automatisch auf `main`
und deployed nach Pages.

Lokal bauen:
```bash
npm run build
# Ergebnis in docs/
```

> **Hinweis zur Base‑URL:** In `vite.config.ts` ist `base: './'` gesetzt, damit die App unter `/docs` funktioniert.
> Für Pages muss im Repo unter **Settings → Pages** die Quelle auf **GitHub Actions** stehen.

## Architektur

* **Canvas/Rendering:** SVG mit Layern für Darm, Pankreas, Leber (vereinfachte Couinaud‑Segmente), Gallenblase, Milz.
* **Drag & Drop:** Palette (links) → Drop auf Canvas fügt Baustein hinzu.
* **Nummerierte Marker & Fußnoten:** Jeder Baustein erhält automatisch eine laufende Markernummer. Rechts: Fußnotenliste (drag‑sort) ↔ synchron zu Markern (Re‑Indexing).
* **Undo/Redo:** History‑Stack (Zustand).
* **Persistenz:** `localStorage` + zustandskodierte URL (`lz-string`, `compressToEncodedURIComponent`).
* **QR‑Code:** QR enthält die komplette URL mit `?state=...` (kein externer Dienst).
* **Export:** PNG (html2canvas) und PDF (jsPDF + svg2pdf.js). PDF enthält Kopfzeile (Metadaten) & Fußnotenliste (mehrseitig).
* **Barrierefreiheit & I18n:** ARIA‑Labels (wo sinnvoll), Tastatur‑Shortcuts, de/en via einfachem Wörterbuch.

## Tastatur‑Shortcuts

* `Ctrl/Cmd + Z/Y` Undo/Redo
* `Del` Löschen
* `Ctrl/Cmd + D` Duplizieren

## Datenschutz

* Es findet **kein Upload** von Patient:innendaten statt.
* Optionale Pseudonymisierung über ID/Initialen.

## Designentscheidungen (Defaults)

* **Farben:** Blau `#1f4ed8` (Anastomosen), Rot `#dc2626` (Resektion), Neutral `#6b7280` (Drainagen), Orange `#f59e0b` (Stoma), Lebersegmente halbtransparent Rot.
* **Schriften:** System‑UI; klare Kontraste.
* **Layout:** Linke Palette, zentrales SVG, rechtes Properties/Footnotes‑Panel, Topbar mit Datei/Export/QR/Einstellungen.
* **Skalierung & Export:** PNG 300 dpi skaliert; PDF A4 inkl. Kopfzeile und Fußnoten.

## Tests

* **Unit:** Vitest (`tests/unit`) – Encoding & Store.
* **E2E:** Playwright (`tests/e2e`) – Minimaler Smoke‑Test.

## Roadmap / Optional (v2)

* Rotieren/Skalieren über Handles, Spline‑Editor für Drainagen, erweiterte Snapping‑Landmarken.
* Virtualisierte Fußnotenliste (>100) – kann mit `react-window` nachgerüstet werden.
* Dark Mode, Vorlagenverwaltung, Team‑Freigabe per URL, Messwerkzeug (mm‑Skala).

// Simplified organ paths and landmarks (not anatomically exact)
export const bowelPath = 'M 100 200 C 200 100, 400 100, 500 200 S 700 300, 800 200 900 100, 1100 200 1200 300, 1400 200'
export const pancreasPath = 'M 600 500 C 650 470, 800 470, 900 520 S 1100 580, 1200 560'
export const liverOutline = 'M 900 200 C 800 150, 700 150, 600 200 L 500 300 C 550 350, 650 380, 800 360 C 950 340, 1000 300, 1050 260 Z'
export const gallbladderPath = 'M 680 300 c 0 -30 40 -30 40 0 c 0 30 -40 30 -40 0 Z'
export const spleenPath = 'M 1200 300 c -40 -30 -40 30 0 60 c 40 30 40 -30 0 -60 Z'

export const liverSegments = [
  { key: 'liver_S4', path: 'M 700 230 L 760 220 L 820 240 L 780 280 Z' },
  { key: 'liver_S5', path: 'M 650 260 L 700 300 L 760 290 L 730 250 Z' },
  { key: 'liver_S6', path: 'M 620 270 L 650 310 L 700 300 L 660 260 Z' },
  { key: 'liver_S7', path: 'M 600 230 L 620 270 L 660 260 L 640 220 Z' },
  { key: 'liver_S8', path: 'M 740 220 L 800 210 L 840 230 L 820 260 Z' },
  { key: 'liver_S2', path: 'M 540 240 L 580 250 L 600 230 L 560 220 Z' },
  { key: 'liver_S3', path: 'M 560 280 L 600 300 L 650 260 L 600 250 Z' },
  { key: 'liver_S1', path: 'M 690 260 L 720 260 L 720 280 L 690 280 Z' },
]

import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        anastomosis: '#1f4ed8', // blue
        resection: '#dc2626',   // red
        drain: '#6b7280',       // neutral
        stoma: '#f59e0b',       // orange
        liverSeg: 'rgba(220,38,38,0.25)',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    }
  },
  plugins: []
} satisfies Config

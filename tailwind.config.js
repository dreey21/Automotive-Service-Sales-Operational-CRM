/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Space Grotesk',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'ui-monospace',
  				'monospace'
  			]
  		},
  		colors: {
  			// ── 4DM Brand Palette ──────────────────────────────
  			// Navy:      #1B2A3B  (logo outer ring, primary)
  			// Steel Blue:#A8C4D4  (car body)
  			// Ice Blue:  #7BA7BC  (snowflake / secondary)
  			// Pale Sky:  #D6E8F0  (muted surfaces)
  			// Off-White: #F4F8FB  (page background)
  			// ───────────────────────────────────────────────────
  			brand: {
  				navy:       '#101923',
  				steel:      '#A8C4D4',
  				ice:        '#7BA7BC',
  				sky:        '#D6E8F0',
  				offwhite:   '#F4F8FB',
  				'navy-800': '#253a50',
  				'navy-700': '#2f4d69',
  				'navy-100': '#e8f2f8',
  			},

  			// ── CSS-variable-driven tokens (Shadcn compatible) ──
  			background:         'var(--background)',
  			'background-alt':   'var(--background-alt)',
  			foreground:         'var(--foreground)',
  			muted: {
  				DEFAULT:    'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			'muted-foreground': 'var(--muted-foreground)',
  			accent: {
  				DEFAULT:    'var(--accent)',
  				foreground: 'var(--accent-foreground)',
  				muted:      'var(--accent-muted)',
  			},
  			'accent-foreground': 'var(--accent-foreground)',
  			card: {
  				DEFAULT:    'var(--card)',
  				solid:      'var(--card-solid)',
  				foreground: 'var(--foreground)'
  			},
  			popover: {
  				DEFAULT:    'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT:    'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT:    'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			destructive: {
  				DEFAULT:    'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input:  'var(--input)',
  			ring:   'var(--ring)',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'in': 'fadeIn 200ms ease-out',
  		},
  		keyframes: {
  			fadeIn: {
  				'0%':   { opacity: '0' },
  				'100%': { opacity: '1' }
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
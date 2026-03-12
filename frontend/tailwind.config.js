export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Colores Base
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        
        // 2. Estructura y Fondos
        'bg-global': 'var(--color-bg-global)',
        sidebar: 'var(--color-sidebar)',
        surface: 'var(--color-surface)',
        
        // 3. Neobrutalismo
        neoborder: 'var(--color-border)',
        neoshadow: 'var(--color-shadow)',
        
        // 4. Textos y Alertas
        'text-main': 'var(--color-text-main)',
        'text-light': 'var(--color-text-light)',
        alert: 'var(--color-alert)',
      }
    },
  },
  plugins: [],
}

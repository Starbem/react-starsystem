import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      include: ['src'],
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'index.css' ? 'style.css' : (assetInfo.name ?? '[name][extname]'),
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
})

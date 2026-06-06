import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 개발 중 백엔드(FastAPI) 프록시 - 필요 시 활성화
    // proxy: { '/api': 'http://localhost:8000' },
  },
})

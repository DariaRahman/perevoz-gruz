import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { deliverLead, loadLocalEnv, readJsonBody } from './server/deliverLead.mjs'

function leadApiPlugin(): Plugin {
  return {
    name: 'lead-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/lead' || req.method !== 'POST') {
          next()
          return
        }

        // Читаем .env на каждый запрос — чтобы правки подхватывались без рестарта.
        const env = loadLocalEnv(server.config.root)

        try {
          const payload = await readJsonBody(req)
          await deliverLead(payload, env)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ ok: true }))
        } catch (error) {
          console.error('[lead-api]', error)
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({
            ok: false,
            error: error instanceof Error ? error.message : 'Ошибка отправки',
          }))
        }
      })
    },
  }
}

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), leadApiPlugin()],
})

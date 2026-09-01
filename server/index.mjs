import { createServer } from 'node:http'
import { deliverLead, loadLocalEnv, readJsonBody } from './deliverLead.mjs'

const env = loadLocalEnv()
const port = Number(env.LEAD_API_PORT || 8787)

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS' && req.url === '/api/lead') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST' || req.url !== '/api/lead') {
    res.writeHead(404)
    res.end(JSON.stringify({ ok: false, error: 'Not found' }))
    return
  }

  try {
    const payload = await readJsonBody(req)
    await deliverLead(payload, env)
    res.writeHead(200)
    res.end(JSON.stringify({ ok: true }))
  } catch (error) {
    res.writeHead(400)
    res.end(JSON.stringify({
      ok: false,
      error: error instanceof Error ? error.message : 'Ошибка отправки',
    }))
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Lead API: http://127.0.0.1:${port}/api/lead`)
})

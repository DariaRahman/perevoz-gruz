import { request as httpsRequest } from 'node:https'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadLocalEnv(root = process.cwd()) {
  const env = { ...process.env }

  for (const file of ['.env', '.env.local']) {
    const path = resolve(root, file)
    if (!existsSync(path)) continue

    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const text = line.trim().replace(/^\uFEFF/, '')
      if (!text || text.startsWith('#')) continue
      const index = text.indexOf('=')
      if (index === -1) continue
      const key = text.slice(0, index).trim()
      const value = text.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')
      if (env[key] == null || env[key] === '') env[key] = value
    }
  }

  return env
}

export function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function formatMinskDateTime(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return formatMinskDateTime()

  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Minsk',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const pick = (type) => parts.find((part) => part.type === type)?.value || '00'
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}:${pick('second')}`
}

function explainNetworkError(error) {
  const details = [error?.message, error?.code].filter(Boolean).join(': ')
  if (/self-signed|certificate|CERT|UNABLE_TO_VERIFY/i.test(details)) {
    return 'Ошибка SSL при обращении к Telegram (антивирус/прокси). Повторите отправку.'
  }
  return details || 'Не удалось связаться с Telegram'
}

function outboundRequest(url, { method = 'GET', headers = {}, body } = {}, allowInsecure = false, redirects = 0) {
  return new Promise((resolvePromise, rejectPromise) => {
    const target = new URL(url)
    const req = httpsRequest(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        method,
        headers,
        rejectUnauthorized: !allowInsecure,
      },
      (res) => {
        const location = res.headers.location
        if (location && res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && redirects < 5) {
          res.resume()
          const keepMethod = res.statusCode === 307 || res.statusCode === 308
          const nextMethod = keepMethod ? method : 'GET'
          const nextHeaders = { ...headers }
          const nextBody = keepMethod ? body : undefined
          if (!keepMethod) {
            delete nextHeaders['Content-Length']
            delete nextHeaders['Content-Type']
          }
          outboundRequest(location, { method: nextMethod, headers: nextHeaders, body: nextBody }, allowInsecure, redirects + 1)
            .then(resolvePromise)
            .catch(rejectPromise)
          return
        }

        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8')
          let json = {}
          try {
            json = raw ? JSON.parse(raw) : {}
          } catch {
            json = { raw }
          }
          resolvePromise({
            ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300,
            status: res.statusCode || 500,
            json: async () => json,
          })
        })
      },
    )

    req.on('error', (error) => rejectPromise(error))
    if (body) req.write(body)
    req.end()
  })
}

async function outboundFetch(url, options = {}) {
  try {
    return await outboundRequest(url, options, false)
  } catch (secureError) {
    const details = String(secureError?.message || secureError?.code || '')
    if (/self-signed|certificate|CERT|UNABLE_TO_VERIFY/i.test(details)) {
      return outboundRequest(url, options, true)
    }
    throw new Error(explainNetworkError(secureError))
  }
}

export async function deliverLead(payload, env = loadLocalEnv()) {
  const name = String(payload.name || '').trim()
  const phone = String(payload.phone || '').trim()
  const moveType = String(payload.moveType || '').trim()
  const address = String(payload.address || '').trim()
  const moveDate = String(payload.moveDate || '').trim()
  const comment = String(payload.comment || '').trim()
  const sourceChannel = String(payload.sourceChannel || '').trim()
  const source = String(payload.source || (
    sourceChannel === 'card' ? 'Из карточки' :
    sourceChannel === 'form' ? 'Форма на сайте' :
    'Кнопка на сайте'
  )).trim()
  const submittedAt = formatMinskDateTime(payload.submittedAt)
  const notifyEmail = String(env.LEAD_NOTIFY_EMAIL || '').trim()

  if (!name || !phone) {
    throw new Error('Укажите ФИО и телефон')
  }
  if (!moveType || !address || !moveDate) {
    throw new Error('Укажите тип переезда, адрес и дату')
  }

  const token = String(env.TELEGRAM_BOT_TOKEN || '').trim()
  const chatIds = String(env.TELEGRAM_CHAT_ID || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
  const sheetsUrl = String(env.GOOGLE_SHEETS_URL || env.VITE_GOOGLE_SHEETS_URL || '').trim()
  const hasTelegram = Boolean(token && chatIds.length)
  const hasSheets = Boolean(sheetsUrl)

  if (!hasTelegram && !hasSheets) {
    throw new Error('Не заданы Google Таблица или Telegram в файле .env')
  }

  const text = [
    '<b>Новая заявка PEREVOZ_GRUZ</b>',
    '',
    `<b>Дата записи:</b> ${escapeHtml(submittedAt)}`,
    `<b>ФИО:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Тип переезда:</b> ${escapeHtml(moveType)}`,
    `<b>Желаемая дата:</b> ${escapeHtml(moveDate)}`,
    `<b>Адрес (откуда и куда):</b> ${escapeHtml(address)}`,
    `<b>Комментарий:</b> ${escapeHtml(comment || '—')}`,
    `<b>Откуда заявка:</b> ${escapeHtml(source)}`,
  ].join('\n')

  if (hasTelegram) {
    const body = JSON.stringify({
      chat_id: chatIds[0],
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })

    let telegramResponse
    try {
      telegramResponse = await outboundFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      })
    } catch (error) {
      throw new Error(explainNetworkError(error))
    }

    const telegramResult = await telegramResponse.json()
    if (!telegramResponse.ok || telegramResult.ok === false) {
      throw new Error(telegramResult.description || 'Telegram не принял заявку. Проверьте токен и chat id.')
    }

    await Promise.all(chatIds.slice(1).map(async (chatId) => {
      const extraBody = JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
      return outboundFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(extraBody),
        },
        body: extraBody,
      }).catch(() => null)
    }))
  }

  if (hasSheets) {
    const sheetBody = JSON.stringify({
      name,
      phone,
      moveType,
      address,
      moveDate,
      comment,
      source,
      sourceChannel,
      submittedAt,
      notifyEmail,
    })
    try {
      const sheetResponse = await outboundFetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
          'Content-Length': Buffer.byteLength(sheetBody),
        },
        body: sheetBody,
      })
      const sheetResult = await sheetResponse.json()
      if (!sheetResponse.ok || sheetResult.ok === false) {
        console.error('[sheets]', sheetResult.error || sheetResult.raw || `HTTP ${sheetResponse.status}`)
      }
    } catch (error) {
      console.error('[sheets]', error instanceof Error ? error.message : error)
    }
  }

  return { ok: true }
}

export async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

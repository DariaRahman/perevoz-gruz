import { formatLeadOrigin, type LeadSource } from './leadSource'

export type LeadPayload = {
  name: string
  phone: string
  moveType: string
  address: string
  moveDate: string
  comment: string
  source: LeadSource
}

export async function submitLead(payload: LeadPayload) {
  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      moveType: payload.moveType,
      address: payload.address,
      moveDate: payload.moveDate,
      comment: payload.comment,
      source: formatLeadOrigin(payload.source),
      sourceChannel: payload.source.channel,
      submittedAt: new Date().toISOString(),
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.ok === false) {
    throw new Error(result.error || 'Не удалось отправить заявку')
  }
}

import type { LeadSource } from './leadSource'

export const LEAD_MODAL_EVENT = 'open-lead-modal'

export function openLeadModal(source: LeadSource = { channel: 'button' }) {
  window.dispatchEvent(new CustomEvent<LeadSource>(LEAD_MODAL_EVENT, { detail: source }))
}

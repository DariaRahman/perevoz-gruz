export type LeadChannel = 'card' | 'button' | 'form'

export type LeadSource = {
  channel: LeadChannel
  label?: string
}

export function formatLeadOrigin(source: LeadSource): string {
  if (source.channel === 'card') {
    return source.label ? `Из карточки: ${source.label}` : 'Из карточки'
  }
  if (source.channel === 'form') {
    return 'Форма на сайте'
  }
  return 'Кнопка на сайте'
}

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import LeadForm from './LeadForm'
import { LEAD_MODAL_EVENT } from '../lib/leadModal'
import type { LeadSource } from '../lib/leadSource'

export default function LeadModal() {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<LeadSource>({ channel: 'button' })

  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<LeadSource>).detail
      setSource(detail?.channel ? detail : { channel: 'button' })
      setOpen(true)
    }
    window.addEventListener(LEAD_MODAL_EVENT, show)
    return () => window.removeEventListener(LEAD_MODAL_EVENT, show)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('lead-open', open)
    return () => document.body.classList.remove('lead-open')
  }, [open])

  const close = () => setOpen(false)

  if (!open) return null

  return (
    <div className="lead-overlay" role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <button className="lead-backdrop" type="button" aria-label="Закрыть окно заявки" onClick={close} />
      <div className="lead-panel">
        <button type="button" className="legal-close lead-close" onClick={close} aria-label="Закрыть">
          <X />
        </button>
        <p className="eyebrow">Заявка</p>
        <h2 id="lead-title">Рассчитать стоимость</h2>
        <p className="lead-intro">
          Все поля обязательны, кроме комментария. Перезвоним и назовём цену.
        </p>
        <LeadForm source={source} onSuccess={close} />
      </div>
    </div>
  )
}

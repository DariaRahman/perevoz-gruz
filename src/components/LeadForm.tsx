import { useId, useState, type FormEvent } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import type { LeadSource } from '../lib/leadSource'
import { OPERATOR } from '../legal/documents'

const MOVE_TYPES = ['Квартирный', 'Офисный', 'Дачный', 'Грузчики'] as const

type LeadFormProps = {
  source: LeadSource
  onSuccess?: () => void
}

export default function LeadForm({ source, onSuccess }: LeadFormProps) {
  const formId = useId()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (String(data.get('company_site') || '').trim()) {
      setStatus('success')
      onSuccess?.()
      return
    }

    setStatus('loading')
    setError('')

    try {
      await submitLead({
        name: String(data.get('name') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        moveType: String(data.get('moveType') || '').trim(),
        address: String(data.get('address') || '').trim(),
        moveDate: String(data.get('moveDate') || '').trim(),
        comment: String(data.get('comment') || '').trim(),
        source,
      })
      setStatus('success')
      form.reset()
      onSuccess?.()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    }
  }

  return (
    <form className="contact-form lead-form" onSubmit={onSubmit}>
      <label>
        <span>ФИО</span>
        <input type="text" name="name" placeholder="Иванов Иван Иванович" autoComplete="name" required />
      </label>
      <label>
        <span>Телефон</span>
        <input
          type="tel"
          name="phone"
          placeholder="+375 (__) ___-__-__"
          autoComplete="tel"
          inputMode="tel"
          required
        />
      </label>
      <label>
        <span>Тип переезда</span>
        <select name="moveType" required defaultValue="">
          <option value="" disabled>Выберите тип</option>
          {MOVE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Желаемая дата</span>
        <input type="date" name="moveDate" required min={new Date().toISOString().slice(0, 10)} />
      </label>
      <label className="form-wide">
        <span>Адрес (откуда и куда)</span>
        <input
          type="text"
          name="address"
          placeholder="Могилёв, ул. … → Могилёв, ул. …"
          required
        />
      </label>
      <label className="form-wide">
        <span>Комментарий</span>
        <textarea name="comment" rows={3} placeholder="Этажи, лифт, объём, удобное время" />
      </label>
      <label className="hp-field" aria-hidden="true">
        <span>Сайт компании</span>
        <input type="text" name="company_site" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="form-wide consent-check">
        <input type="checkbox" name="consent" required />
        <span>
          Даю согласие на обработку персональных данных согласно{' '}
          <a href="#privacy">Политике обработки персональных данных</a>.
        </span>
      </label>
      <button type="submit" className={status === 'success' ? 'is-sent' : ''} disabled={status === 'loading'}>
        {status === 'loading' && 'Отправляем...'}
        {status === 'success' && 'Заявка принята'}
        {(status === 'idle' || status === 'error') && 'Рассчитать стоимость'}
        {status === 'loading' ? <LoaderCircle className="spin" /> : status === 'success' ? <Check /> : null}
      </button>
      {status === 'success' && (
        <p className="form-success" role="status" id={`${formId}-ok`}>
          Спасибо! Перезвоним и назовём стоимость.
        </p>
      )}
      {status === 'error' && (
        <p className="form-error" role="alert">{error}</p>
      )}
      <small>
        Исполнитель: {OPERATOR.shortName}, УНП {OPERATOR.unp}.
      </small>
    </form>
  )
}

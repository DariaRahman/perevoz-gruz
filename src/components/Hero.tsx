import { ArrowRight } from 'lucide-react'
import { openLeadModal } from '../lib/leadModal'
import { OPERATOR } from '../legal/documents'

const chips = ['Без скрытых доплат', 'Работаем 24/7', 'Могилёв и за город']

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Грузоперевозки и грузчики</p>
        <h1>Переезд без головной боли</h1>
        <p className="hero-lead">
          {OPERATOR.brand} — грузовой транспорт, профессиональные грузчики
          и прозрачный расчёт. Честные цены, работаем 24/7. Платите только
          за фактическое время, без скрытых доплат.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" type="button" onClick={() => openLeadModal({ channel: 'button' })}>
            Рассчитать стоимость
            <ArrowRight size={18} />
          </button>
        </div>
        <ul className="hero-chips">
          {chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </div>
      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=80"
          alt="Упакованные коробки к переезду"
          width={1200}
          height={900}
        />
        <div className="hero-badge">
          <strong>24/7</strong>
          <span>Выезд, когда удобно вам</span>
        </div>
      </div>
    </section>
  )
}

import { openLeadModal } from '../lib/leadModal'

const services = [
  {
    emoji: '🚚',
    title: 'Грузовая машина + грузчики',
    price: 'от 75 руб/час',
    note: 'В черте города · минимум 2 часа',
    text: 'Идеально для переезда квартиры, дачи или перевозки крупной мебели.',
  },
  {
    emoji: '💪',
    title: 'Только грузчики',
    price: 'от 40 руб/час',
    note: 'С человека · минимум 2 часа',
    text: 'Подъём и спуск вещей, перестановка мебели без аренды машины.',
  },
  {
    emoji: '📦',
    title: 'Такелажные работы',
    price: 'от 100 руб',
    note: 'Фикс за работу',
    text: 'Сложные и объёмные грузы. Стоимость зависит от сложности и объёма.',
  },
  {
    emoji: '🏗',
    title: 'Подъём стройматериалов',
    price: 'от 30 руб',
    note: 'Расчёт индивидуально',
    text: 'Точная стоимость — после оценки объёма работ.',
  },
  {
    emoji: '🚛',
    title: 'Аренда машины без грузчиков',
    price: 'от 50 руб/час',
    note: 'Минимум 1,5 часа',
    text: 'Для индивидуального переезда: загружаете вещи в кузов сами.',
  },
  {
    emoji: '🗑',
    title: 'Вывоз мусора',
    price: 'от 140 руб',
    note: 'За 1 ходку · 2–3 грузчика',
    text: 'Стоимость зависит от объёма. В цену входит работа бригады.',
  },
  {
    emoji: '🏢',
    title: 'Полный комплекс: 2 машины + 4 грузчика',
    price: 'от 170 руб/час',
    note: 'Без минимального времени',
    text: 'Большие квартиры, дома, офисы и цеха. Две машины и бригада работают синхронно — переезд быстрее примерно в 2 раза.',
    featured: true,
  },
]

export default function ServicesSection() {
  return (
    <section className="services section" id="services">
      <div className="wrap block">
        <div className="section-head is-split">
          <div>
            <p className="eyebrow">Калькулятор услуг</p>
            <h2>Понятные цены — без скрытых доплат</h2>
          </div>
          <p className="section-lead">
            Карточки — ориентир. Итог считаем по фактическому времени и объёму.
          </p>
        </div>
        <div className="service-grid">
          {services.map((item) => (
            <article className={`price-card${item.featured ? ' is-featured' : ''}`} key={item.title}>
              <span className="price-emoji" aria-hidden="true">{item.emoji}</span>
              <h3>{item.title}</h3>
              <p className="price-value">{item.price}</p>
              <p className="price-note">{item.note}</p>
              <p>{item.text}</p>
              <button type="button" onClick={() => openLeadModal({ channel: 'card', label: item.title })}>
                Рассчитать
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

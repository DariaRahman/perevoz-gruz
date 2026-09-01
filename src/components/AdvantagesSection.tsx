const items = [
  { title: 'Работаем 24/7', text: 'Переезд ночью, в выходной или срочно — выезжаем, когда удобно вам.' },
  { title: 'Аккуратность', text: 'Упаковываем, защищаем мебель и доносим вещи без сколов и царапин.' },
  { title: 'Опыт', text: 'Квартиры, дачи, офисы и такелаж — знаем, как поднять и погрузить без сюрпризов.' },
  { title: 'Работа с юрлицами', text: 'Договор, закрывающие документы и расчёт под задачи компании.' },
]

export default function AdvantagesSection() {
  return (
    <section className="advantages section" id="advantages">
      <div className="wrap block">
        <div className="section-head">
          <p className="eyebrow">Почему мы</p>
          <h2>Чисто, вовремя и по понятной цене</h2>
        </div>
        <div className="advantage-grid">
          {items.map((item, index) => (
            <article className="advantage-card" key={item.title}>
              <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

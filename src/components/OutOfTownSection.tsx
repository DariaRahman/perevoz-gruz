const city = {
  title: 'Только грузовая машина',
  items: [
    'Тариф: от 2 руб/км (расчёт в две стороны).',
    'Время на загрузку: 20 минут — бесплатно.',
    'Простой более 20 минут: 45 руб/час (первый час оплачивается полностью).',
  ],
}

const withCrew = {
  title: 'Машина + грузчики',
  items: [
    'Подача машины: от 2 руб/км (расчёт в две стороны).',
    'Простой машины: 35 руб/час с момента прибытия и звонка клиенту.',
    'Работа грузчиков: от 40 руб/час. Минимум бригады — 3 часа.',
  ],
}

export default function OutOfTownSection() {
  return (
    <section className="out-of-town section" id="out-of-town">
      <div className="wrap block">
        <div className="section-head">
          <p className="eyebrow">Поездки за город</p>
          <h2>Честные условия за пределами города</h2>
        </div>
        <div className="town-grid">
          {[city, withCrew].map((block) => (
            <article className="town-card" key={block.title}>
              <h3>{block.title}</h3>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

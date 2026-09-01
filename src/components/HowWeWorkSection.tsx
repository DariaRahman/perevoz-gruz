const steps = [
  { n: '01', title: 'Заявка', text: 'Оставляете имя, телефон, тип переезда и адреса.' },
  { n: '02', title: 'Расчёт', text: 'Считаем стоимость и подтверждаем дату и время.' },
  { n: '03', title: 'Перевозка', text: 'Приезжаем, грузим, везём и заносим вещи на место.' },
  { n: '04', title: 'Оплата', text: 'Платите за фактическое время работы — без скрытых доплат.' },
]

export default function HowWeWorkSection() {
  return (
    <section className="how section" id="how">
      <div className="wrap block">
        <div className="section-head">
          <p className="eyebrow">Как мы работаем</p>
          <h2>Четыре простых шага</h2>
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

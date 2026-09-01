import LeadForm from './LeadForm'

export default function ContactSection() {
  return (
    <section className="contact-wrap section" id="contact">
      <div className="wrap block">
        <div className="contact">
          <div className="contact-copy">
            <p className="eyebrow">Заявка</p>
            <h2>Рассчитать стоимость</h2>
            <p>
              ФИО, телефон, тип переезда, адреса и дата. Комментарий — по желанию.
              После оформления заявки с Вами свяжутся специалисты.
            </p>
          </div>
          <LeadForm source={{ channel: 'form' }} />
        </div>
      </div>
    </section>
  )
}

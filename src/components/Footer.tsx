import { Instagram } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { legalNav, OPERATOR } from '../legal/documents'

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') return <Instagram size={18} />
  return null
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <BrandLogo className="footer-brand" />
        <div className="footer-contacts">
          {OPERATOR.phone && <a className="footer-phone" href={`tel:${OPERATOR.phone.replace(/\s/g, '')}`}>{OPERATOR.phone}</a>}
          {OPERATOR.email && <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>}
          {OPERATOR.socials.map((item) => (
            <a
              className="footer-social"
              href={item.href}
              key={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon label={item.label} />
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <nav className="footer-legal" aria-label="Юридические документы">
        {legalNav.map((item) => (
          <a href={`#${item.id}`} key={item.id}>{item.label}</a>
        ))}
      </nav>
      <p className="footer-legal-line">
        {OPERATOR.shortName} · УНП {OPERATOR.unp} · {OPERATOR.city}
      </p>
    </footer>
  )
}

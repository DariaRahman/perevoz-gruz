import { useEffect, useState } from 'react'
import { Instagram, Menu, X } from 'lucide-react'
import { openLeadModal } from '../lib/leadModal'
import { OPERATOR } from '../legal/documents'
import BrandLogo from './BrandLogo'

const instagram = OPERATOR.socials.find((item) => item.label === 'Instagram')

const links = [
  { href: '#journey', label: 'Маршрут' },
  { href: '#services', label: 'Услуги' },
  { href: '#out-of-town', label: 'За город' },
  { href: '#save', label: 'Как сэкономить' },
  { href: '#how', label: 'Как работаем' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <>
      <header className="header">
        <BrandLogo />

        <nav className="desktop-nav" aria-label="Основная навигация">
          {links.map((link) => (
            <a href={link.href} key={link.href}>{link.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          {instagram && (
            <a
              className="header-social"
              href={instagram.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram PEREVOZ_GRUZ"
            >
              <Instagram size={20} />
            </a>
          )}
          <button className="header-cta" type="button" onClick={() => openLeadModal({ channel: 'button' })}>
            Рассчитать стоимость
          </button>
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        id="mobile-navigation"
        aria-label="Мобильная навигация"
        aria-hidden={!menuOpen}
      >
        {links.map((link) => (
          <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        {instagram && (
          <a href={instagram.href} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
            Instagram
          </a>
        )}
        <button type="button" onClick={() => { setMenuOpen(false); openLeadModal({ channel: 'button' }) }}>
          Рассчитать стоимость
        </button>
      </nav>
    </>
  )
}

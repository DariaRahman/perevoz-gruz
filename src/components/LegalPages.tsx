import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { legalDocs, legalNav, type LegalDocId } from '../legal/documents'

function getDocFromHash(): LegalDocId | null {
  const hash = window.location.hash.replace('#', '')
  return legalDocs.some((doc) => doc.id === hash) ? (hash as LegalDocId) : null
}

export default function LegalPages() {
  const [activeId, setActiveId] = useState<LegalDocId | null>(getDocFromHash)

  useEffect(() => {
    const onHash = () => setActiveId(getDocFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('legal-open', Boolean(activeId))
    return () => document.body.classList.remove('legal-open')
  }, [activeId])

  const doc = useMemo(
    () => legalDocs.find((item) => item.id === activeId) ?? null,
    [activeId],
  )

  const close = () => {
    const { pathname, search } = window.location
    window.history.pushState(null, '', `${pathname}${search}`)
    setActiveId(null)
  }

  if (!doc) return null

  return (
    <div className="legal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div className="legal-panel">
        <header className="legal-head">
          <div>
            <p className="eyebrow dark"><span />Документы сайта · РБ</p>
            <h2 id="legal-title">{doc.title}</h2>
            <time>Редакция от {doc.updated}</time>
          </div>
          <button type="button" className="legal-close" onClick={close} aria-label="Закрыть документ">
            <X />
          </button>
        </header>

        {legalNav.length > 1 && (
          <nav className="legal-nav" aria-label="Список документов">
            {legalNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={item.id === doc.id ? 'is-active' : ''}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="legal-body">
          {doc.sections.map((section) => (
            <article key={section.heading}>
              <h3>{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

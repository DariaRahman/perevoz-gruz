import { useEffect, useRef, useState, type CSSProperties } from 'react'

const STAGES = [
  { title: 'Заявка принята', text: 'Считаем маршрут и подаём машину к нужному времени.' },
  { title: 'Упаковка', text: 'Грузчики собирают вещи, пока кузов ещё не стоит под окнами.' },
  { title: 'Погрузка', text: 'Мебель и коробки аккуратно встают в машину.' },
  { title: 'В пути', text: 'Едем по городу или за город — без лишнего простоя.' },
  { title: 'Выгрузка', text: 'Заносим на место. Платите за фактическое время работы.' },
]

function City() {
  return (
    <svg className="road-city" viewBox="0 0 640 140" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="#1b1612"
        d="M0 140V78h28V44h18v20h22V28h16v50h20V56h36V22h24v34h18V48h40V18h20v42h16V62h32V36h22v40h18V52h28V30h20v48h24V68h36V40h18v38h22V58h30v82H0Z"
      />
      <g fill="#f15a24" opacity="0.22">
        <rect x="40" y="56" width="3" height="5" />
        <rect x="48" y="56" width="3" height="5" />
        <rect x="92" y="40" width="3" height="5" />
        <rect x="100" y="40" width="3" height="5" />
        <rect x="168" y="30" width="3" height="5" />
        <rect x="176" y="30" width="3" height="5" />
        <rect x="248" y="70" width="3" height="5" />
        <rect x="320" y="46" width="3" height="5" />
        <rect x="400" y="40" width="3" height="5" />
        <rect x="468" y="50" width="3" height="5" />
        <rect x="540" y="68" width="3" height="5" />
      </g>
    </svg>
  )
}

function Van() {
  return (
    <svg className="road-truck-svg" viewBox="0 0 248 92" aria-hidden="true">
      <ellipse cx="124" cy="84" rx="98" ry="5" fill="rgba(0,0,0,0.35)" />
      <rect x="16" y="16" width="148" height="50" rx="3" fill="#f4ece3" />
      <path d="M24 24h132M24 36h132M24 48h132" stroke="#d5c8bb" strokeWidth="1" />
      <path d="M164 22h46c8 0 14 6 16 14l4 20h-66V22Z" fill="#f15a24" />
      <path d="M174 28h28l7 16h-35V28Z" fill="#2a241f" />
      <rect x="16" y="56" width="214" height="7" fill="#2a241f" />
      <circle cx="50" cy="70" r="12" fill="#1b1612" />
      <circle cx="50" cy="70" r="5" fill="#c4b8ac" />
      <circle cx="190" cy="70" r="12" fill="#1b1612" />
      <circle cx="190" cy="70" r="5" fill="#c4b8ac" />
    </svg>
  )
}

export default function ScrollRoad() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    if (!section || !scene) return

    const truck = scene.querySelector<HTMLElement>('.road-truck')
    let target = 0
    let current = 0
    let frame = 0
    let lastStage = -1

    const apply = (p: number) => {
      scene.style.setProperty('--p', p.toFixed(4))
      if (truck) {
        const max = Math.max(0, scene.clientWidth - truck.offsetWidth - 20)
        truck.style.transform = `translate3d(${(p * max).toFixed(1)}px, 0, 0)`
      }
      if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`

      const next = Math.min(STAGES.length - 1, Math.floor(p * 0.999 * STAGES.length))
      if (next !== lastStage) {
        lastStage = next
        setStage(next)
      }
    }

    const readTarget = () => {
      const rect = section.getBoundingClientRect()
      const start = window.innerHeight * 0.95
      const end = -rect.height * 0.45
      const raw = (start - rect.top) / Math.max(1, start - end)
      target = Math.min(1, Math.max(0, raw))
    }

    const tick = () => {
      current += (target - current) * 0.045
      if (Math.abs(target - current) < 0.0004) {
        current = target
        apply(current)
        frame = 0
        return
      }
      apply(current)
      frame = requestAnimationFrame(tick)
    }

    const kick = () => {
      readTarget()
      if (!frame) frame = requestAnimationFrame(tick)
    }

    kick()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [])

  const current = STAGES[stage]

  return (
    <section className="road-journey" id="journey" ref={sectionRef} aria-label="Анимация переезда">
      <div className="wrap block">
      <div className="road-sticky">
        <div className="road-copy">
          <p className="eyebrow">Маршрут</p>
          <h2>От заявки до выгрузки</h2>
          <p className="road-status" key={current.title}>
            <strong>{current.title}</strong>
            {current.text}
          </p>
          <ol className="road-dots">
            {STAGES.map((item, index) => (
              <li key={item.title} className={index === stage ? 'is-active' : index < stage ? 'is-done' : ''}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.title}
              </li>
            ))}
          </ol>
        </div>

        <div className="road-scene" ref={sceneRef} style={{ '--p': 0 } as CSSProperties}>
          <div className="road-meta">
            <span>Откуда</span>
            <span ref={percentRef}>0%</span>
            <span>Куда</span>
          </div>
          <City />
          <div className="road-bed" aria-hidden="true">
            <div className="road-lane" />
          </div>
          <div className="road-truck">
            <Van />
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

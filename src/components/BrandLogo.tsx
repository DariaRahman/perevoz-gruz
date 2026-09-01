import { OPERATOR } from '../legal/documents'

type BrandLogoProps = {
  className?: string
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <a className={`brand ${className}`.trim()} href="#top" aria-label={`${OPERATOR.brand} — на главную`}>
      <img className="brand-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={59} height={40} />
      <span className="brand-text">{OPERATOR.brand}</span>
    </a>
  )
}

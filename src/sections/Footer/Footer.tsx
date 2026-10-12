import { Logo } from '../../components/Logo/Logo'
import { nav, site } from '../../data/site'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer id="contactos" className={styles.footer}>
      <div className={styles.top}>
        <a href="#inicio" className={styles.logo}>
          <Logo />
        </a>
        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <address className={styles.address}>
          <a href={site.maps} target="_blank" rel="noreferrer">
            <Pin />
            <span>
              {site.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </a>
        </address>
        <ul className={styles.social}>
          <li>
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram />
            </a>
          </li>
          <li>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook />
            </a>
          </li>
        </ul>
      </div>
      <div className={styles.bottom}>
        <p>© {year} Titan Leça. Todos os direitos reservados.</p>
        <p className={styles.tagline}>Mais saúde. Mais vida.</p>
      </div>
    </footer>
  )
}

function Pin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="1.7" fill="currentColor" />
    </svg>
  )
}

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.6" cy="7.4" r="0.8" fill="currentColor" />
    </svg>
  )
}

function Facebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 9h2.2V6.4h-2.2c-2.1 0-3.5 1.4-3.5 3.6V12H8.4V15H10.5v5h3V15h2.3l.4-3H13.5V10c0-.6.3-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  )
}

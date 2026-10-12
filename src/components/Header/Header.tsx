import { useEffect, useId, useRef, useState } from 'react'
import { nav } from '../../data/site'
import { Button } from '../Button/Button'
import { Logo } from '../Logo/Logo'
import styles from './Header.module.css'

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let frame = 0
    const update = () => {
      header.classList.toggle(styles.scrolled, window.scrollY > 8)
      frame = 0
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const navElement = navRef.current
    if (!navElement) return

    const links = [...navElement.querySelectorAll<HTMLAnchorElement>('[data-nav]')]
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.hash))
      .filter((section): section is HTMLElement => section !== null)

    const setCurrent = (id: string) => {
      for (const link of links) {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target instanceof HTMLElement && visible.target.id) {
          setCurrent(visible.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const header = headerRef.current
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    if (!open) {
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      document.body.style.overflow = ''
      if (wasOpen.current) buttonRef.current?.focus()
      wasOpen.current = false
      return
    }

    wasOpen.current = true
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'

    const focusable = header
      ? [...header.querySelectorAll<HTMLElement>('a, button')].filter(
          (element) => element.getClientRects().length > 0,
        )
      : []

    navRef.current?.querySelector<HTMLElement>('[data-nav]')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.bar}>
        <a href="#inicio" className={styles.logoLink}>
          <Logo />
        </a>
        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.burger} data-open={open ? '' : undefined}>
            <span />
            <span />
          </span>
          <span className="srOnly">{open ? 'Fechar menu' : 'Abrir menu'}</span>
        </button>
        <nav
          ref={navRef}
          id={menuId}
          className={open ? `${styles.nav} ${styles.open}` : styles.nav}
          aria-label="Principal"
          {...(open ? { role: 'dialog' as const, 'aria-modal': true as const, 'aria-label': 'Menu' } : {})}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setOpen(false)
          }}
        >
          <ul className={styles.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-nav
                  className={styles.link}
                  aria-current={item.href === '#inicio' ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#experiencia" size="compact">
            Experimenta
          </Button>
        </nav>
      </div>
    </header>
  )
}

import type { ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'solid' | 'ghost' | 'light' | 'ink'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: 'default' | 'compact'
  className?: string
  external?: boolean
}

export function Button({
  href,
  children,
  variant = 'solid',
  size = 'default',
  className,
  external = false,
}: Props) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <a href={href} className={classes} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      <span>{children}</span>
      <svg className={styles.arrow} viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

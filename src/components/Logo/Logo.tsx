import lockupSvg from '../../assets/logo-wordmark.svg?raw'
import markSvg from '../../assets/logo-mark.svg?raw'
import styles from './Logo.module.css'

type Props = {
  variant?: 'full' | 'mark'
  className?: string
}

function inline(source: string) {
  return source.replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
}

export function Logo({ variant = 'full', className }: Props) {
  const classes = [styles.logo, className].filter(Boolean).join(' ')
  const graphic = variant === 'full' ? lockupSvg : markSvg

  return (
    <span className={classes}>
      <span
        className={variant === 'full' ? styles.lockup : styles.mark}
        dangerouslySetInnerHTML={{ __html: inline(graphic) }}
      />
      {variant === 'full' ? (
        <span className="srOnly">Titan Leça, movimento com saúde</span>
      ) : null}
    </span>
  )
}

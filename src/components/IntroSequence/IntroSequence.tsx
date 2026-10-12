import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import {
  claimOrigin,
  introAlreadySettled,
  introPauseAt,
  introTiming,
  markIntroSettled,
} from '../../intro/playIntro'
import { introFrames, introHasPortrait } from './frames'
import styles from './IntroSequence.module.css'

type Props = {
  onDone: () => void
}

const blocked = 'header, main, footer'

function setPageBlocked(blockedNow: boolean) {
  for (const element of document.querySelectorAll<HTMLElement>(blocked)) {
    if (blockedNow) element.setAttribute('inert', '')
    else element.removeAttribute('inert')
  }
}

export function IntroSequence({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)

  useLayoutEffect(() => {
    onDoneRef.current = onDone
  })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (introAlreadySettled()) {
      setPageBlocked(false)
      onDoneRef.current()
      return
    }

    const origin = claimOrigin()
    const elapsed = performance.now() - origin
    let cancelled = false

    for (const animation of root.getAnimations({ subtree: true })) {
      animation.currentTime = elapsed
    }

    const pauseAt = introPauseAt()
    if (pauseAt !== null) {
      for (const animation of root.getAnimations({ subtree: true })) {
        animation.currentTime = pauseAt
        animation.pause()
      }
      return
    }

    const revealDelay = Math.max(0, introTiming.REVEAL_AT - elapsed)
    const revealTimer = window.setTimeout(() => {
      if (cancelled) return
      document.documentElement.classList.add('is-revealing')
      setPageBlocked(false)
    }, revealDelay)

    const finish = () => {
      if (cancelled || introAlreadySettled()) return
      if (performance.now() - origin < introTiming.DURATION - 150) return
      markIntroSettled()
      document.documentElement.classList.add('is-revealing')
      document.documentElement.classList.remove('is-intro')
      document.documentElement.classList.add('intro-settled')
      setPageBlocked(false)
      onDoneRef.current()
    }

    const exit = root.getAnimations().find((animation) => {
      const duration = animation.effect?.getComputedTiming().duration
      return duration === introTiming.DURATION
    })
    const finished = exit?.finished.then(() => {
      if (!cancelled) finish()
    }, () => {})
    const backup = window.setTimeout(finish, Math.max(0, introTiming.DURATION - elapsed + 50))

    return () => {
      cancelled = true
      window.clearTimeout(revealTimer)
      window.clearTimeout(backup)
      void finished
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || introAlreadySettled()) return

    setPageBlocked(true)
    const images = [...root.querySelectorAll('img')]
    const cleanups: Array<() => void> = []

    for (const img of images) {
      const shot = img.closest<HTMLElement>('[data-shot]')
      if (!shot) continue

      const ready = () => {
        if (img.naturalWidth === 0) return
        const show = () => shot.setAttribute('data-ready', '')
        if (typeof img.decode === 'function') void img.decode().then(show, show)
        else show()
      }
      const fail = () => shot.setAttribute('data-skip', '')

      if (img.complete) {
        if (img.naturalWidth > 0) ready()
        else fail()
      } else {
        img.addEventListener('load', ready)
        img.addEventListener('error', fail)
        cleanups.push(() => {
          img.removeEventListener('load', ready)
          img.removeEventListener('error', fail)
        })
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.intro} data-intro="" aria-hidden="true">
      <div className={styles.stage} data-art={introHasPortrait ? 'portrait' : 'widescreen'}>
        <div className={styles.origin}>
          <span className={styles.line} />
        </div>
        {introFrames.map((frame) => (
          <div
            key={frame.id}
            className={`${styles.shot} ${styles[frame.id]}`}
            data-shot={frame.id}
            style={
              frame.position
                ? ({ '--shot-position': frame.position } as CSSProperties)
                : undefined
            }
          >
            <picture>
              {frame.portrait ? (
                <>
                  <source
                    media="(max-width: 767px)"
                    type="image/avif"
                    srcSet={frame.portrait.avif}
                    sizes="100vw"
                  />
                  <source
                    media="(max-width: 767px)"
                    type="image/webp"
                    srcSet={frame.portrait.webp}
                    sizes="100vw"
                  />
                </>
              ) : null}
              <source type="image/avif" srcSet={frame.asset.avif} sizes="100vw" />
              <source type="image/webp" srcSet={frame.asset.webp} sizes="100vw" />
              <img
                src={frame.asset.src}
                alt=""
                width={frame.asset.width}
                height={frame.asset.height}
                decoding="async"
                fetchPriority={frame.priority}
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  )
}

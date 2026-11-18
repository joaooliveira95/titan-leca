import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button/Button'
import { Logo } from '../../components/Logo/Logo'
import { Picture } from '../../components/Picture/Picture'
import { Reveal } from '../../components/Reveal/Reveal'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { images } from '../../data/images'
import styles from './Studio.module.css'

const studioWide = '/videos/studio.mp4'
const studioPortrait = '/videos/studio-portrait.mp4'
const portraitQuery = '(max-width: 767px)'

function filmSource() {
  return window.matchMedia(portraitQuery).matches ? studioPortrait : studioWide
}

function prefersSaveData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return connection?.saveData === true
}

export function Studio() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()
  const [live, setLive] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [sound, setSound] = useState(false)
  const soundRef = useRef(sound)
  soundRef.current = sound

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (reduced || prefersSaveData()) {
      photoRef.current?.removeAttribute('data-live')
      setLive(false)
      setSound(false)
      return
    }
    if (!section || !video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.preload = 'auto'

    const useSource = (keepPlace: boolean) => {
      const next = filmSource()
      const current = video.currentSrc || video.getAttribute('src') || ''
      if (current.endsWith(next)) return
      const time = keepPlace ? video.currentTime : 0
      const playing = keepPlace && !video.paused
      delete video.dataset.ready
      video.preload = 'auto'
      video.src = next
      video.muted = !soundRef.current
      if (time <= 0.25 && !playing) return
      const resume = () => {
        video.currentTime = time
        if (playing) video.play().catch(() => {})
        video.removeEventListener('loadedmetadata', resume)
      }
      video.addEventListener('loadedmetadata', resume)
    }

    const arm = () => useSource(false)

    const reveal = () => {
      if (video.readyState < 2) return
      video.dataset.ready = 'true'
      photoRef.current?.setAttribute('data-live', '')
      setLive(true)
    }

    const hold = () => {
      const code = video.error?.code
      if (code !== 3 && code !== 4) return
      delete video.dataset.ready
      photoRef.current?.removeAttribute('data-live')
      setLive(false)
    }

    const tryPlay = () => {
      video.muted = !soundRef.current
      video.play().then(reveal).catch(() => {})
    }

    const frame = photoRef.current ?? section
    const playback = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          arm()
          tryPlay()
          return
        }
        if (!entry.isIntersecting) video.pause()
      },
      { threshold: [0, 0.2] },
    )

    const onVisibility = () => {
      if (document.hidden) {
        video.pause()
        return
      }
      const rect = frame.getBoundingClientRect()
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      if (rect.height > 0 && visible / rect.height >= 0.2) tryPlay()
    }

    const onGesture = () => {
      const rect = frame.getBoundingClientRect()
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
      if (onScreen) tryPlay()
    }

    const layout = window.matchMedia(portraitQuery)
    const onLayout = () => {
      if (!video.getAttribute('src')) return
      useSource(true)
    }

    playback.observe(frame)
    video.addEventListener('loadeddata', reveal)
    video.addEventListener('canplay', reveal)
    video.addEventListener('playing', reveal)
    video.addEventListener('error', hold)
    reveal()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('touchend', onGesture, { passive: true })
    window.addEventListener('pointerup', onGesture)
    layout.addEventListener('change', onLayout)

    return () => {
      playback.disconnect()
      video.removeEventListener('loadeddata', reveal)
      video.removeEventListener('canplay', reveal)
      video.removeEventListener('playing', reveal)
      video.removeEventListener('error', hold)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('touchend', onGesture)
      window.removeEventListener('pointerup', onGesture)
      layout.removeEventListener('change', onLayout)
      video.pause()
    }
  }, [reduced])

  useEffect(() => {
    const onChange = () => setExpanded(document.fullscreenElement === photoRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    const photo = photoRef.current
    const video = videoRef.current
    if (!photo || !video) return

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
      return
    }

    if (typeof photo.requestFullscreen === 'function') {
      photo.requestFullscreen().catch(() => {
        const ios = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
        ios.webkitEnterFullscreen?.()
      })
      return
    }

    const ios = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    ios.webkitEnterFullscreen?.()
  }

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    const next = video.muted
    video.muted = !next
    if (!video.muted) {
      video.volume = 1
      video.play().catch(() => {})
    }
    setSound(!video.muted)
  }

  return (
    <section ref={sectionRef} id="sobre" className={styles.studio} aria-labelledby="studio-title">
      <div ref={photoRef} className={styles.photo}>
        <Picture image={images.studio} />
        {reduced || prefersSaveData() ? null : (
          <video
            ref={videoRef}
            className={styles.video}
            src={filmSource()}
            muted={!sound}
            playsInline
            loop
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
          />
        )}
        <div className={styles.scrim} />
        <div className={styles.photoCopy} inert={live ? true : undefined}>
          <Reveal>
            <p className={styles.kicker}>Um espaço em Leça</p>
            <h2 id="studio-title">
              Movimento
              <br />
              Pessoas
              <br />
              Resultados
            </h2>
            <Button href="#experiencia" variant="light">
              Conhece o espaço
            </Button>
          </Reveal>
        </div>
        {reduced || prefersSaveData() ? null : (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              tabIndex={live ? 0 : -1}
              aria-hidden={live ? undefined : true}
              aria-pressed={sound}
              aria-label={sound ? 'Silenciar' : 'Som'}
              onClick={toggleSound}
            >
              {sound ? (
                <svg className={styles.controlIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M2.5 6.4h2.1L8 3.6v8.8L4.6 9.6H2.5V6.4zM10.2 6.1a2.8 2.8 0 0 1 0 3.8M11.8 4.6a5 5 0 0 1 0 6.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className={styles.controlIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M2.5 6.4h2.1L8 3.6v8.8L4.6 9.6H2.5V6.4zM11 6.2l3 3.6M14 6.2l-3 3.6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={styles.control}
              tabIndex={live ? 0 : -1}
              aria-hidden={live ? undefined : true}
              aria-label={expanded ? 'Fechar' : 'Ecrã inteiro'}
              onClick={toggleFullscreen}
            >
              {expanded ? (
                <svg className={styles.controlIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg className={styles.controlIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10M10 13.5h3.5V10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      <div className={styles.side}>
        <Reveal delay={80}>
          <h2>
            Há projetos
            <br />
            que nascem para
            <br />
            mudar rotinas.
          </h2>
          <p>
            Outros nascem para mudar a forma como olhamos para a nossa saúde.
          </p>
          <p>
            Está a nascer um novo espaço em Leça da Palmeira. Um espaço onde o movimento deve
            cuidar das pessoas.
          </p>
          <Logo variant="mark" className={styles.mark} />
        </Reveal>
      </div>
    </section>
  )
}

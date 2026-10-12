const DURATION = 2600
const REVEAL_AT = 2259

let origin: number | null = null
let settled = false

/** `?intro=1&t=1400` pauses the sequence at that millisecond so a frame can be inspected. */
export function introPauseAt() {
  const value = new URLSearchParams(window.location.search).get('t')
  if (value === null || !new URLSearchParams(window.location.search).get('intro')) return null
  const at = Number(value)
  return Number.isFinite(at) ? at : null
}

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Call before React paints so the hero entrance does not flash. */
export function armIntro() {
  if (shouldPlayIntro()) document.documentElement.classList.add('is-intro')
}

/**
 * One clock for the whole sequence. Survives the StrictMode remount so the
 * CSS animations seek forward instead of restarting from the first frame.
 */
export function claimOrigin() {
  const now = performance.now()
  if (origin === null || now - origin > DURATION + 400) origin = now
  return origin
}

export function introAlreadySettled() {
  return settled
}

export function markIntroSettled() {
  settled = true
}

export const introTiming = { DURATION, REVEAL_AT }

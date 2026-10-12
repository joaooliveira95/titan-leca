/**
 * Widescreen masters are 1672×941. `portrait` is reserved for a later
 * phone crop of the same moment. The overlay never references the hero
 * photograph: when a logo-free beach plate exists, replace `images.hero`
 * and the fade at the end of this sequence reveals it.
 */
export type IntroAsset = {
  avif: string
  webp: string
  src: string
  width: number
  height: number
}

export type IntroFrame = {
  id: 'structure' | 'material' | 'place' | 'identity' | 'brand' | 'movement' | 'reveal'
  asset: IntroAsset
  portrait?: IntroAsset
  position?: string
  /** First frames share the hero's priority band only as `auto`. Later frames stay low. */
  priority: 'auto' | 'low'
}

const widths = [768, 1280, 1672] as const

function asset(id: string): IntroAsset {
  return {
    avif: widths.map((width) => `/images/intro/${id}-${width}.avif ${width}w`).join(', '),
    webp: widths.map((width) => `/images/intro/${id}-${width}.webp ${width}w`).join(', '),
    src: `/images/intro/${id}-1280.webp`,
    width: 1672,
    height: 941,
  }
}

export const introFrames: readonly IntroFrame[] = [
  { id: 'structure', asset: asset('structure'), priority: 'auto' },
  { id: 'material', asset: asset('material'), priority: 'auto' },
  { id: 'place', asset: asset('place'), priority: 'low' },
  { id: 'identity', asset: asset('identity'), priority: 'low' },
  { id: 'brand', asset: asset('brand'), priority: 'low' },
  { id: 'movement', asset: asset('movement'), priority: 'low' },
  { id: 'reveal', asset: asset('reveal'), priority: 'low' },
]

export const introHasPortrait = introFrames.some((frame) => frame.portrait)

export type PictureAsset = {
  name: string
  alt: string
  width: number
  height: number
  widths: readonly number[]
  sizes: string
  priority?: boolean
}

export const images = {
  hero: {
    name: 'hero',
    alt: 'Atleta a treinar com battle ropes sob uma estrutura de betão, em fotografia a preto e branco.',
    width: 1600,
    height: 2000,
    widths: [640, 960, 1280, 1600],
    sizes: '(min-width: 1024px) 42vw, 100vw',
    priority: true,
  },
  individual: {
    name: 'individual',
    alt: 'Pormenor das mãos e de um haltere durante um treino individual.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  duo: {
    name: 'duo',
    alt: 'Três pessoas a correr em contraluz, com o tratamento laranja da marca.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  group: {
    name: 'group',
    alt: 'Fila de kettlebells preparados para uma aula de grupo.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  studio: {
    name: 'studio',
    alt: 'Interior de um estúdio de treino com luz natural, passadeiras e zona de pesos.',
    width: 2000,
    height: 1334,
    widths: [800, 1200, 1600, 2000],
    sizes: '(min-width: 1024px) 58vw, 100vw',
  },
} as const satisfies Record<string, PictureAsset>

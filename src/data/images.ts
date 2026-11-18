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
    alt: 'Atletas junto ao paredão de Leça, com o mar e o porto ao fundo.',
    width: 1600,
    height: 2000,
    widths: [640, 960, 1280, 1600],
    sizes: '(min-width: 1024px) 42vw, 100vw',
    priority: true,
  },
  individual: {
    name: 'individual',
    alt: 'Treinador a acompanhar um treino individual numa máquina de cabos.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  duo: {
    name: 'duo',
    alt: 'Treino em trio no estúdio, com acompanhamento de um treinador.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  group: {
    name: 'group',
    alt: 'Aula de grupo no estúdio, com várias pessoas a treinar em simultâneo.',
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    sizes: '(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw',
  },
  studio: {
    name: 'studio',
    alt: 'Aula no estúdio, com o grupo deitado no chão e dois treinadores ao fundo.',
    width: 2000,
    height: 1334,
    widths: [800, 1200, 1600, 2000],
    sizes: '(min-width: 1024px) 58vw, 100vw',
  },
} as const satisfies Record<string, PictureAsset>

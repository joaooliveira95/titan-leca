import { Picture } from '../../components/Picture/Picture'
import { Reveal } from '../../components/Reveal/Reveal'
import { images } from '../../data/images'
import styles from './Services.module.css'

const cards = [
  {
    id: 'treino-individual',
    title: 'Treino individual',
    text: 'Acompanhamento focado nos teus objetivos.',
    image: images.individual,
  },
  {
    id: 'duo-trio',
    title: 'Duo / trio',
    text: 'Treina com quem te motiva. Mais energia, melhores resultados.',
    image: images.duo,
  },
  {
    id: 'aulas-de-grupo',
    title: 'Aulas de grupo',
    text: 'Variedade, comunidade e um ambiente que inspira.',
    image: images.group,
  },
]

export function Services() {
  return (
    <section id="servicos" className={styles.section} aria-labelledby="services-title">
      <div className={styles.layout}>
        <Reveal>
          <div className={styles.intro}>
            <p className={styles.kicker}>Os nossos serviços</p>
            <h2 id="services-title">
              Treino
              <br />
              à tua medida
            </h2>
            <p>
              Acompanhamento personalizado, ambiente motivador e uma abordagem focada na tua saúde
              e longo prazo.
            </p>
            <a className={styles.textLink} href="#treino-individual">
              Conhece os serviços
              <Arrow />
            </a>
          </div>
        </Reveal>
        <ul id="servicos-lista" className={styles.cards}>
          {cards.map((card, index) => (
            <li key={card.id} id={card.id}>
              <Reveal delay={index * 80}>
                <a className={styles.card} href="#experiencia">
                  <div className={styles.frame}>
                    <Picture image={card.image} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className={styles.more}>
                    Saber mais
                    <Arrow />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Arrow() {
  return (
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
  )
}

import { Button } from '../../components/Button/Button'
import { Picture } from '../../components/Picture/Picture'
import { images } from '../../data/images'
import styles from './Hero.module.css'

const services = [
  ['Treino', 'individual'],
  ['Duo /', 'trio'],
  ['Aulas', 'de grupo'],
]

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <div className={styles.intro}>
          <p className={`${styles.eyebrow} ${styles.rise} ${styles.d1}`}>Mais que treino</p>
          <h1 id="hero-title" className={`${styles.title} ${styles.rise} ${styles.d2}`}>
            <span className={styles.mark}>Movimento</span>
            <span className={styles.rest}>com saúde</span>
          </h1>
          <p className={`${styles.lede} ${styles.rise} ${styles.d3}`}>
            Treino, bem-estar e longevidade. Num só espaço.
          </p>
          <div className={`${styles.cta} ${styles.rise} ${styles.d5}`}>
            <Button href="#experiencia">Quero experimentar</Button>
          </div>
        </div>
        <ul className={`${styles.services} ${styles.rise} ${styles.d6}`}>
          {services.map(([line, next]) => (
            <li key={line}>
              {line}
              <br />
              {next}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${styles.media} ${styles.rise} ${styles.d4}`}>
        <p className={styles.motto}>
          Mais força
          <br />
          Mais saúde
          <br />
          Mais vida
        </p>
        <div className={styles.frame}>
          <Picture image={images.hero} />
          <p className={styles.place}>
            Leça da Palmeira
            <br />
            Matosinhos
          </p>
        </div>
      </div>
    </section>
  )
}

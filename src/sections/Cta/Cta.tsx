import { Button } from '../../components/Button/Button'
import { Reveal } from '../../components/Reveal/Reveal'
import { site } from '../../data/site'
import styles from './Cta.module.css'

export function Cta() {
  return (
    <section id="experiencia" className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.copy}>
        <Reveal>
          <p className={styles.kicker}>Titan Leça</p>
          <h2 id="cta-title">
            Pronto para
            <br />
            começar?
          </h2>
          <p>Vem conhecer uma forma diferente de treinar.</p>
        </Reveal>
      </div>
      <div className={styles.panel}>
        <Reveal delay={90}>
          <div className={styles.actions}>
            <Button href={site.whatsapp} variant="ink" external>
              Marcar experiência
            </Button>
            <Button href={site.whatsapp} variant="ghost" external>
              Falar connosco
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

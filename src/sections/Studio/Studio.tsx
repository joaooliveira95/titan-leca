import { Button } from '../../components/Button/Button'
import { Logo } from '../../components/Logo/Logo'
import { Picture } from '../../components/Picture/Picture'
import { Reveal } from '../../components/Reveal/Reveal'
import { images } from '../../data/images'
import styles from './Studio.module.css'

export function Studio() {
  return (
    <section id="sobre" className={styles.studio} aria-labelledby="studio-title">
      <div className={styles.photo}>
        <Picture image={images.studio} />
        <div className={styles.scrim} />
        <div className={styles.photoCopy}>
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

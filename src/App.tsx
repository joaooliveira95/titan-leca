import { useState } from 'react'
import { Header } from './components/Header/Header'
import { IntroSequence } from './components/IntroSequence/IntroSequence'
import { Cta } from './sections/Cta/Cta'
import { Footer } from './sections/Footer/Footer'
import { Hero } from './sections/Hero/Hero'
import { Services } from './sections/Services/Services'
import { Studio } from './sections/Studio/Studio'
import { shouldPlayIntro } from './intro/playIntro'

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro)

  return (
    <>
      <a className="skip" href="#inicio">
        Saltar para o conteúdo
      </a>
      <Header />
      <main>
        <Hero />
        <Services />
        <Studio />
        <Cta />
      </main>
      <Footer />
      {intro ? <IntroSequence onDone={() => setIntro(false)} /> : null}
    </>
  )
}

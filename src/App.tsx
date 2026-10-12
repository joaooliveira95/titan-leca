import { Header } from './components/Header/Header'
import { Cta } from './sections/Cta/Cta'
import { Footer } from './sections/Footer/Footer'
import { Hero } from './sections/Hero/Hero'
import { Services } from './sections/Services/Services'
import { Studio } from './sections/Studio/Studio'

export default function App() {
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
    </>
  )
}

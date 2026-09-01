import { lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'
import LegalPages from './components/LegalPages'
import LeadModal from './components/LeadModal'

const BelowFold = lazy(() => import('./components/BelowFold'))

function App() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="section-loader" aria-hidden="true" />}>
          <BelowFold />
        </Suspense>
      </main>
      <Footer />
      <LegalPages />
      <LeadModal />
    </div>
  )
}

export default App

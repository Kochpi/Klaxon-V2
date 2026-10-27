import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Accueil from './pages/Accueil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import NotFound from './pages/NotFound.jsx'

// Chaque "Route" associe une adresse (URL) à une page
export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

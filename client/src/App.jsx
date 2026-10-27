import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import Accueil from './pages/Accueil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Detail from './pages/Detail.jsx'
import Proposer from './pages/Proposer.jsx'
import MonEspace from './pages/MonEspace.jsx'
import NotFound from './pages/NotFound.jsx'

// Chaque "Route" associe une adresse (URL) à une page.
// RequireAuth protège les pages qui demandent d'être connecté.
export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/trajets/:id" element={<RequireAuth><Detail /></RequireAuth>} />
          <Route path="/proposer" element={<RequireAuth><Proposer /></RequireAuth>} />
          <Route path="/mon-espace" element={<RequireAuth><MonEspace /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

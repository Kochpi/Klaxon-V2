import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#F5B53D" />
          <path d="M9 13v6h4l6 4V9l-6 4z" fill="#14202B" />
        </svg>
        Klaxon
      </Link>

      <nav className="nav">
        <Link to="/">Trajets</Link>
        <Link to="/proposer">Proposer un trajet</Link>
        {user && <Link to="/mon-espace">Mon espace</Link>}
      </nav>

      {user ? (
        <>
          <span className="user-name">
            {user.prenom} {user.nom}
          </span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <Link to="/connexion" className="btn btn-outline">
            Se connecter
          </Link>
          <Link to="/inscription" className="btn btn-primary">
            S'inscrire
          </Link>
        </>
      )}
    </header>
  )
}

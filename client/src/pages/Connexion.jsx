import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'

export default function Connexion() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')

  async function handleSubmit(event) {
    event.preventDefault() // empêche le navigateur de recharger la page
    setErreur('')

    try {
      await login(email, password)
      navigate(location.state?.from || '/') // retour sur la page qu'on voulait voir
    } catch (err) {
      setErreur(err.message) // ex : "Email ou mot de passe incorrect"
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h1>Connexion</h1>

      <label className="field">
        Adresse email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label className="field">
        Mot de passe
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-large">
        Se connecter
      </button>

      <p className="center muted">
        Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
      </p>
    </form>
  )
}

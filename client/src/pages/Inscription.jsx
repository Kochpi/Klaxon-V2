import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'

export default function Inscription() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '', email: '', password: '' })
  const [erreur, setErreur] = useState('')

  // Met à jour le champ modifié (grâce à l'attribut "name" de chaque input)
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErreur('')

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setErreur(err.message) // ex : "Cet email est déjà utilisé"
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h1>Créer un compte</h1>

      <label className="field">
        Prénom
        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required />
      </label>

      <label className="field">
        Nom
        <input type="text" name="nom" value={form.nom} onChange={handleChange} required />
      </label>

      <label className="field">
        Téléphone
        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required />
      </label>

      <label className="field">
        Adresse email
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label className="field">
        Mot de passe
        <input type="password" name="password" value={form.password} onChange={handleChange} minLength={8} required />
        <span className="muted">8 caractères minimum.</span>
      </label>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-large">
        Créer mon compte
      </button>

      <p className="center muted">
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { AuthContext } from './AuthContext.js'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // null = personne n'est connecté
  const [loading, setLoading] = useState(true)

  // Au chargement du site : on demande à l'API si le cookie correspond à un utilisateur connecté
  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    setUser(data.user)
  }

  async function register(formulaire) {
    const data = await api.post('/auth/register', formulaire)
    setUser(data.user)
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  if (loading) {
    return <p className="container">Chargement…</p>
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

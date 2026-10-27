import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.js'

// Entoure une page réservée aux utilisateurs connectés.
// Si personne n'est connecté : redirection vers la connexion, puis retour sur la page demandée.
export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }
  return children
}

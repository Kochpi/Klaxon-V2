import { createContext, useContext } from 'react'

// Le "contexte" permet à toutes les pages de connaître l'utilisateur connecté
// sans passer l'information de composant en composant.
export const AuthContext = createContext(null)

// Raccourci : const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}

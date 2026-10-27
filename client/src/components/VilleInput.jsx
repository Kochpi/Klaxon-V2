import { useState } from 'react'
import { api } from '../api.js'

// Champ de saisie avec suggestions de villes (autocomplétion).
// Quand l'utilisateur choisit une ville, on appelle onSelect(ville). Sinon onSelect(null).
export default function VilleInput({ label, onSelect }) {
  const [texte, setTexte] = useState('')
  const [suggestions, setSuggestions] = useState([])

  async function handleChange(event) {
    const valeur = event.target.value
    setTexte(valeur)
    onSelect(null) // on a modifié le texte : aucune ville n'est encore choisie

    if (valeur.trim() === '') {
      setSuggestions([])
      return
    }
    const data = await api.get('/villes?q=' + encodeURIComponent(valeur.trim()))
    setSuggestions(data.villes.slice(0, 6))
  }

  function choisir(ville) {
    setTexte(`${ville.nom} (${ville.departement})`)
    setSuggestions([])
    onSelect(ville)
  }

  return (
    <div className="autocomplete">
      <label className="field">
        {label}
        <input type="text" value={texte} onChange={handleChange} autoComplete="off" />
      </label>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((ville) => (
            <li key={ville.id}>
              <button type="button" onClick={() => choisir(ville)}>
                {ville.nom} <span className="muted">({ville.departement})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

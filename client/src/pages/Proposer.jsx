import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import VilleInput from '../components/VilleInput.jsx'

export default function Proposer() {
  const navigate = useNavigate()

  const [depart, setDepart] = useState(null)
  const [arrivee, setArrivee] = useState(null)
  const [dateDepart, setDateDepart] = useState('')
  const [dateArrivee, setDateArrivee] = useState('')
  const [places, setPlaces] = useState(3)
  const [erreur, setErreur] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErreur('')

    if (!depart || !arrivee) {
      setErreur('Choisissez les deux villes dans la liste de suggestions')
      return
    }

    try {
      await api.post('/trajets', {
        ville_depart_id: depart.id,
        ville_arrivee_id: arrivee.id,
        date_depart: dateDepart,
        date_arrivee: dateArrivee,
        places_total: Number(places),
      })
      navigate('/mon-espace')
    } catch (err) {
      setErreur(err.message) // ex : "Le départ doit être dans le futur"
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h1>Proposer un trajet</h1>

      <VilleInput label="Ville de départ" onSelect={setDepart} />
      <VilleInput label="Ville d'arrivée" onSelect={setArrivee} />

      <label className="field">
        Date et heure de départ
        <input type="datetime-local" value={dateDepart} onChange={(e) => setDateDepart(e.target.value)} required />
      </label>

      <label className="field">
        Date et heure d'arrivée
        <input type="datetime-local" value={dateArrivee} onChange={(e) => setDateArrivee(e.target.value)} required />
      </label>

      <label className="field">
        Nombre de places (1 à 9)
        <input type="number" min="1" max="9" value={places} onChange={(e) => setPlaces(e.target.value)} required />
      </label>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-accent btn-large">
        Publier le trajet
      </button>
    </form>
  )
}

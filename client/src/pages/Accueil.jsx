import { useEffect, useState } from 'react'
import { api } from '../api.js'
import VilleInput from '../components/VilleInput.jsx'
import TrajetCard from '../components/TrajetCard.jsx'

export default function Accueil() {
  const [trajets, setTrajets] = useState(null) // null = chargement en cours
  const [erreur, setErreur] = useState('')

  // Les filtres de recherche
  const [depart, setDepart] = useState(null)
  const [arrivee, setArrivee] = useState(null)
  const [date, setDate] = useState('')

  // Au chargement de la page : tous les trajets à venir
  useEffect(() => {
    api
      .get('/trajets')
      .then((data) => setTrajets(data.trajets))
      .catch((err) => setErreur(err.message))
  }, [])

  // Quand on clique sur "Rechercher" : on ajoute les filtres choisis dans l'adresse
  function handleSubmit(event) {
    event.preventDefault()

    const filtres = new URLSearchParams()
    if (depart) filtres.set('depart', depart.id)
    if (arrivee) filtres.set('arrivee', arrivee.id)
    if (date) filtres.set('date', date)

    api
      .get('/trajets?' + filtres.toString())
      .then((data) => setTrajets(data.trajets))
      .catch((err) => setErreur(err.message))
  }

  return (
    <>
      <h1>Où allez-vous ?</h1>

      <form className="card search" onSubmit={handleSubmit}>
        <VilleInput label="Départ" onSelect={setDepart} />
        <VilleInput label="Arrivée" onSelect={setArrivee} />
        <label className="field">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-accent">
          Rechercher
        </button>
      </form>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      {trajets === null && !erreur && <p>Chargement…</p>}

      {trajets !== null && (
        <>
          <h2>
            {trajets.length} trajet{trajets.length > 1 ? 's' : ''} à venir
          </h2>
          <div className="liste">
            {trajets.map((trajet) => (
              <TrajetCard key={trajet.id} trajet={trajet} />
            ))}
          </div>
          {trajets.length === 0 && <p className="muted">Aucun trajet ne correspond à votre recherche.</p>}
        </>
      )}
    </>
  )
}

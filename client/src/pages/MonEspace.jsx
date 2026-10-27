import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { formatDate, formatHeure } from '../utils/format.js'

export default function MonEspace() {
  const [reservations, setReservations] = useState(null)
  const [trajets, setTrajets] = useState(null)
  const [erreur, setErreur] = useState('')
  const [version, setVersion] = useState(0) // on l'augmente pour recharger les listes

  useEffect(() => {
    Promise.all([api.get('/reservations'), api.get('/trajets/mes-trajets')])
      .then(([dataReservations, dataTrajets]) => {
        setReservations(dataReservations.reservations)
        setTrajets(dataTrajets.trajets)
      })
      .catch((err) => setErreur(err.message))
  }, [version])

  async function annulerReservation(trajetId) {
    if (!window.confirm('Annuler cette réservation ?')) return
    try {
      await api.delete('/reservations/' + trajetId)
      setVersion(version + 1)
    } catch (err) {
      setErreur(err.message)
    }
  }

  async function supprimerTrajet(trajetId) {
    if (!window.confirm('Supprimer ce trajet ? Les réservations seront supprimées aussi.')) return
    try {
      await api.delete('/trajets/' + trajetId)
      setVersion(version + 1)
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (reservations === null || trajets === null) {
    return erreur ? (
      <p className="alert" role="alert">
        {erreur}
      </p>
    ) : (
      <p>Chargement…</p>
    )
  }

  return (
    <>
      <h1>Mon espace</h1>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      <h2>Mes réservations</h2>
      <div className="liste">
        {reservations.length === 0 && <p className="muted">Vous n'avez réservé aucun trajet.</p>}
        {reservations.map((r) => (
          <article key={r.id} className="card ligne">
            <div className="ligne-texte">
              <strong>
                {r.ville_depart} → {r.ville_arrivee}
              </strong>
              <span className="muted">
                {formatDate(r.date_depart)} · {formatHeure(r.date_depart)} · conducteur {r.conducteur_prenom} {r.conducteur_nom.charAt(0)}.
              </span>
            </div>
            <Link to={`/trajets/${r.trajet_id}`} className="btn btn-outline">
              Voir / donner un avis
            </Link>
            <button className="btn btn-danger" onClick={() => annulerReservation(r.trajet_id)}>
              Annuler
            </button>
          </article>
        ))}
      </div>

      <div className="titre-ligne">
        <h2>Mes trajets proposés</h2>
        <Link to="/proposer" className="btn btn-accent">
          Proposer un trajet
        </Link>
      </div>
      <div className="liste">
        {trajets.length === 0 && <p className="muted">Vous n'avez proposé aucun trajet.</p>}
        {trajets.map((t) => (
          <article key={t.id} className="card ligne">
            <div className="ligne-texte">
              <strong>
                {t.ville_depart} → {t.ville_arrivee}
              </strong>
              <span className="muted">
                {formatDate(t.date_depart)} · {formatHeure(t.date_depart)} → {formatHeure(t.date_arrivee)}
              </span>
            </div>
            <span className={t.places_dispo === 0 ? 'badge badge-complet' : 'badge badge-places'}>
              {t.places_dispo === 0 ? 'Complet' : `${t.places_dispo} place${t.places_dispo > 1 ? 's' : ''} sur ${t.places_total}`}
            </span>
            <button className="btn btn-danger" onClick={() => supprimerTrajet(t.id)}>
              Supprimer
            </button>
          </article>
        ))}
      </div>
    </>
  )
}

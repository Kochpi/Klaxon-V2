import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth/AuthContext.js'
import AvisForm from '../components/AvisForm.jsx'
import { formatDate, formatHeure } from '../utils/format.js'

export default function Detail() {
  const { id } = useParams() // le numéro du trajet, pris dans l'adresse
  const { user } = useAuth()

  const [trajet, setTrajet] = useState(null)
  const [avis, setAvis] = useState(null) // { moyenne, nombre, avis: [...] }
  const [aReserve, setAReserve] = useState(false)
  const [erreur, setErreur] = useState('')
  const [version, setVersion] = useState(0) // on l'augmente pour recharger les données

  useEffect(() => {
    Promise.all([api.get('/trajets/' + id), api.get('/reservations')])
      .then(([dataTrajet, dataReservations]) => {
        setTrajet(dataTrajet.trajet)
        setAReserve(dataReservations.reservations.some((r) => r.trajet_id === dataTrajet.trajet.id))
        return api.get('/avis/conducteur/' + dataTrajet.trajet.user_id)
      })
      .then((dataAvis) => setAvis(dataAvis))
      .catch((err) => setErreur(err.message))
  }, [id, version])

  function recharger() {
    setVersion(version + 1)
  }

  async function handleReserver() {
    setErreur('')
    try {
      await api.post('/reservations', { trajet_id: trajet.id })
      recharger()
    } catch (err) {
      setErreur(err.message)
    }
  }

  if (erreur && !trajet) {
    return (
      <>
        <p className="alert" role="alert">
          {erreur}
        </p>
        <Link to="/">← Retour aux trajets</Link>
      </>
    )
  }
  if (!trajet || !avis) {
    return <p>Chargement…</p>
  }

  const monTrajet = trajet.user_id === user.id
  const complet = trajet.places_dispo === 0

  return (
    <>
      <p>
        <Link to="/">← Retour aux trajets</Link>
      </p>

      <div className="detail">
        <section className="detail-principal">
          <div className="card">
            <h1>
              {trajet.ville_depart} ({trajet.departement_depart}) → {trajet.ville_arrivee} ({trajet.departement_arrivee})
            </h1>
            <div className="infos">
              <div>
                <span className="muted">Départ</span>
                <strong>
                  {formatDate(trajet.date_depart)} à {formatHeure(trajet.date_depart)}
                </strong>
              </div>
              <div>
                <span className="muted">Arrivée</span>
                <strong>
                  {formatDate(trajet.date_arrivee)} à {formatHeure(trajet.date_arrivee)}
                </strong>
              </div>
              <div>
                <span className="muted">Places</span>
                <strong>
                  {trajet.places_dispo} sur {trajet.places_total} disponibles
                </strong>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Votre conducteur</h2>
            <p className="conducteur-nom">
              {trajet.conducteur_prenom} {trajet.conducteur_nom}
            </p>
            <p className="muted">
              {avis.moyenne !== null ? (
                <>
                  <span className="etoile">★</span> {avis.moyenne.toString().replace('.', ',')} sur 5 · {avis.nombre} avis
                </>
              ) : (
                "Pas encore d'avis"
              )}
            </p>
            <div className="infos">
              <div>
                <span className="muted">Téléphone</span>
                <strong>{trajet.conducteur_telephone}</strong>
              </div>
              <div>
                <span className="muted">Email</span>
                <strong>{trajet.conducteur_email}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Avis sur {trajet.conducteur_prenom}</h2>
            {avis.avis.length === 0 && <p className="muted">Aucun avis pour le moment.</p>}
            {avis.avis.map((a, index) => (
              <div key={index} className="avis-item">
                <strong>{a.auteurPrenom}</strong> <span className="etoile">★</span> {a.note} sur 5
                {a.commentaire && <p>{a.commentaire}</p>}
              </div>
            ))}
          </div>
        </section>

        <aside className="detail-cote">
          <div className="card">
            <p className="places-restantes">
              {complet ? 'Trajet complet' : `${trajet.places_dispo} place${trajet.places_dispo > 1 ? 's' : ''} restante${trajet.places_dispo > 1 ? 's' : ''}`}
            </p>

            {monTrajet && <p className="muted">C'est votre trajet : vous ne pouvez pas le réserver.</p>}
            {aReserve && <p className="succes">Réservation confirmée : vous avez une place sur ce trajet.</p>}
            {erreur && (
              <p className="alert" role="alert">
                {erreur}
              </p>
            )}

            {!monTrajet && !aReserve && (
              <button className="btn btn-accent btn-large btn-block" onClick={handleReserver} disabled={complet}>
                Réserver une place
              </button>
            )}
          </div>

          {aReserve && <AvisForm trajetId={trajet.id} onDone={recharger} />}
        </aside>
      </div>
    </>
  )
}

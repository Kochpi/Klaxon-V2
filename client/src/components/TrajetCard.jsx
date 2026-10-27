import { formatDate, formatHeure } from '../utils/format.js'

// Une ligne de la liste des trajets
export default function TrajetCard({ trajet }) {
  const complet = trajet.places_dispo === 0

  return (
    <article className="card trajet">
      <div className="trajet-date">
        <strong>{formatDate(trajet.date_depart)}</strong>
        <span className="muted">
          {formatHeure(trajet.date_depart)} → {formatHeure(trajet.date_arrivee)}
        </span>
      </div>

      <div className="trajet-route">
        <div className="trajet-villes">
          {trajet.ville_depart} ({trajet.departement_depart}) → {trajet.ville_arrivee} ({trajet.departement_arrivee})
        </div>
        <div className="muted">
          {trajet.conducteur_prenom} {trajet.conducteur_nom.charAt(0)}.
        </div>
      </div>

      <span className={complet ? 'badge badge-complet' : 'badge badge-places'}>
        {complet ? 'Complet' : `${trajet.places_dispo} place${trajet.places_dispo > 1 ? 's' : ''}`}
      </span>
    </article>
  )
}

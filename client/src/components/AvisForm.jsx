import { useState } from 'react'
import { api } from '../api.js'

// Formulaire pour donner un avis (réservé aux passagers du trajet)
export default function AvisForm({ trajetId, onDone }) {
  const [note, setNote] = useState(5)
  const [commentaire, setCommentaire] = useState('')
  const [erreur, setErreur] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErreur('')

    try {
      await api.post('/avis', { trajet_id: trajetId, note, commentaire })
      setCommentaire('')
      onDone() // la page recharge la liste des avis
    } catch (err) {
      setErreur(err.message) // ex : "Vous avez déjà donné votre avis sur ce trajet"
    }
  }

  return (
    <form className="card avis-form" onSubmit={handleSubmit}>
      <h2>Donner votre avis</h2>

      <div className="note-buttons" role="group" aria-label="Note de 1 à 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n === note ? 'note-btn actif' : 'note-btn'}
            aria-pressed={n === note}
            onClick={() => setNote(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <label className="field">
        Commentaire (facultatif)
        <textarea rows="3" maxLength={500} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
      </label>

      {erreur && (
        <p className="alert" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" className="btn btn-primary">
        Envoyer mon avis
      </button>
    </form>
  )
}

import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <h1>Page introuvable</h1>
      <p>
        <Link to="/">Retour à l'accueil</Link>
      </p>
    </>
  )
}

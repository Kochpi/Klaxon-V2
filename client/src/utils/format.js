// Les dates de l'API ressemblent à "2026-11-05 08:00:00"

// -> "jeu. 5 nov."
export function formatDate(texte) {
  const date = new Date(texte.replace(' ', 'T'))
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

// -> "08:00"
export function formatHeure(texte) {
  return texte.slice(11, 16)
}

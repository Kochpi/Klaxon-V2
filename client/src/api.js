// Fonction qui envoie une requête à l'API et renvoie la réponse en objet JavaScript.
// Si le serveur répond avec une erreur (400, 401, 404...), on lève une erreur avec son message.
async function request(method, url, body) {
  const options = { method, headers: {} }

  if (body) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  // "/api" est redirigé vers le serveur Express (voir vite.config.js).
  // Le cookie de connexion est envoyé automatiquement par le navigateur.
  const response = await fetch('/api' + url, options)

  if (response.status === 204) {
    return null // 204 = succès sans contenu
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue')
  }
  return data
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  delete: (url) => request('DELETE', url),
}

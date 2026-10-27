# NOTES.md — Journal de conception Klaxon v2

Ce fichier garde la trace des choix techniques et de leurs arguments.
Il servira de matière première pour le dossier de projet (sections réalisations, sécurité, veille).

---

## 1. Point de départ

Refonte du projet PHP "Touche pas au Klaxon" (MVC, PHP 8.2, MySQL, Bootstrap).
Nouvelle stack : React + Node/Express + MySQL + MongoDB (Atlas).

## 2. Base de données relationnelle (MySQL / MariaDB via XAMPP)

### Choix
- **MySQL conservé** (le projet d'origine l'utilisait) : le référentiel exige une base relationnelle, pas un SGBD précis.
- Base nommée `klaxon_v2` pour ne pas écraser l'ancienne base `klaxon`.
- `agencies` devient **`villes`**, avec un champ `departement` : permet de distinguer les homonymes et d'enrichir l'autocomplétion. 64 villes dans le seed (contre 12 à l'origine).
- `trips` devient **`trajets`**.
- Nouvelle table **`reservations`** (absente à l'origine).

### Contraintes d'intégrité (défense en profondeur)
Le schéma d'origine n'avait aucune contrainte `CHECK` : seul le PHP protégeait les données.
Désormais la base refuse elle-même :
- un trajet dont la ville de départ est la ville d'arrivée
- une date d'arrivée antérieure ou égale au départ
- un nombre de places hors de 1 à 9
- `places_dispo` négatif ou supérieur à `places_total`
- une double réservation du même trajet par le même passager (clé unique `user_id, trajet_id`)

Le code serveur valide aussi ces règles : si une validation applicative est oubliée, la base reste le dernier rempart.

### `ON DELETE CASCADE` sur `reservations`
Supprimer un trajet supprime ses réservations. Sans ça, la suppression d'un trajet réservé échouerait.

### `places_dispo` conservé (donnée dérivée)
- Avantage : filtre « places disponibles » simple et rapide.
- Risque : désynchronisation avec les réservations.
- Parade : il n'est **jamais** fourni par le client ; le serveur le modifie uniquement dans une transaction (à venir).

### Seed
- Les dates sont **relatives** (`CURDATE() + n jours`) : le jeu de données reste valide quel que soit le jour du chargement. L'ancien seed (août 2026) était déjà périmé.
- `places_dispo` est recalculé à partir des réservations : les chiffres sont cohérents.
- 2 trajets passés + 12 trajets à venir ; 1 trajet complet pour tester le refus de réservation.
- Mot de passe de tous les comptes de démo : `password123` (hash bcrypt `$2y$`, compatible Node).

## 3. Points hérités du PHP à corriger (à documenter dans la partie sécurité)

| Problème constaté dans le code PHP | Correction prévue |
|---|---|
| `places_dispo` fourni par le client | Calculé côté serveur |
| Pas de validation métier dans le modèle | Couche métier serveur + `CHECK` en base |
| `deleteTrip` silencieux si rien n'est supprimé | Vérification des lignes affectées (404 / 403) |
| Email et téléphone des conducteurs exposés dans la liste | Exposés seulement à un utilisateur connecté / passager ayant réservé |
| Pas de transaction (course sur la dernière place) | Transaction + `UPDATE ... WHERE places_dispo >= n` |
| Pas de `session_regenerate_id()` à la connexion | Gestion explicite de la session / du jeton |
| Pas de limitation des tentatives de connexion | `express-rate-limit` |
| `SELECT *` ramène le hash du mot de passe | Colonnes explicites |
| Pas d'inscription | Route `register` avec validation + bcrypt |

Points déjà bons à conserver : requêtes préparées, `WHERE id = ? AND user_id = ?` (anti-IDOR),
message d'erreur de connexion générique.

## 4. À venir

- [ ] Collection MongoDB `avis` (index unique `trajetId + auteurId`)
- [x] API : socle Express + connexions MySQL / MongoDB + route de santé (`feat/api-base`)
- [x] API : authentification (`feat/api-auth`)
- [ ] API : villes (autocomplétion), trajets, réservations, avis
- [ ] Maquettes Figma (web + mobile) **avant** le front
- [ ] Front React
- [ ] Jeu d'essai de la fonctionnalité phare (avis + note moyenne)
- [ ] Veille sécurité : tester réellement des failles (IDOR, XSS, injection, brute force) et noter les résultats
- [ ] Captures d'écran web + mobile au fil de l'eau

## 5. Décisions ouvertes

- Hébergement : local pour l'instant, à revoir en fin de projet

## 6. Authentification (`feat/api-auth`)

### Choix : JWT dans un cookie `httpOnly` + `SameSite=Strict`
Trois façons de garder un utilisateur connecté ont été comparées :

| Option | Avantage | Inconvénient retenu |
|---|---|---|
| Session côté serveur (comme le PHP) | Simple, révocable | Il faut stocker les sessions (table ou mémoire) |
| JWT dans `localStorage` | Facile côté React | **Lisible par n'importe quel script (XSS) : un vol de jeton donne accès au compte** |
| **JWT dans un cookie `httpOnly`** | Illisible par JavaScript ; envoyé automatiquement ; pas de stockage serveur | Demande une protection CSRF (assurée par `SameSite=Strict`) |

Retenu : la dernière. Le serveur signe un jeton (HS256, 2 h), le navigateur le renvoie tout seul.

### Mesures de sécurité et leur justification
| Menace | Mesure |
|---|---|
| Vol du jeton par XSS | Cookie `httpOnly` : le JavaScript ne peut pas le lire |
| CSRF (requête forgée depuis un autre site) | `SameSite=Strict` + CORS limité à `CLIENT_URL` + l'API n'accepte que du JSON |
| Mots de passe en clair en cas de fuite de la base | bcrypt (10 tours de calcul), jamais de mot de passe dans une réponse ; colonnes explicites (pas de `SELECT *`) |
| Force brute sur la connexion | `express-rate-limit` : 5 échecs / 15 min / IP (les succès ne comptent pas) |
| Énumération des comptes | Même message « Email ou mot de passe incorrect » dans les deux cas |
| Élévation de privilèges à l'inscription (mass assignment) | Seuls nom, prénom, téléphone, email et mot de passe sont lus ; le rôle est toujours `user` |
| Jeton falsifié | Vérification de la signature par `jwt.verify` (refuse aussi `alg: none`) |
| Compte supprimé mais jeton encore valide | Le middleware relit l'utilisateur en base à chaque requête protégée |
| Injection (objet JSON à la place d'une chaîne) | Validation de type : tout ce qui n'est pas une chaîne est rejeté |
| Injection SQL | Requêtes préparées (`?`) |
| Fuite d'informations | Gestionnaire d'erreur central : aucune trace d'erreur envoyée au client |

### Points d'attention
- **Compatibilité des hash PHP** : le seed contient des hash `$2y$` (PHP). La bibliothèque Node attend `$2b$` (même algorithme) : le préfixe est converti à la volée avant la comparaison.
- **Simplicité volontaire** : le code est écrit avec des notions simples (routes → contrôleur → modèle). Limite connue : le temps de réponse d'un email inconnu est plus court que celui d'un email connu (pas de calcul bcrypt), ce qui pourrait en théorie révéler quels comptes existent. À signaler dans la veille sécurité comme piste d'amélioration.
- **Inscription** : répondre « email déjà utilisé » permet de savoir qu'un email a un compte. Compromis assumé pour une application interne ; la limitation de débit réduit l'abus.
- **Pas de rafraîchissement du jeton** : la session dure 2 h puis il faut se reconnecter. Piste d'évolution.

### Tests réalisés (jeu d'essai pour le dossier)
27 vérifications automatiques, toutes réussies (fichier de test non versionné) : inscription invalide / valide, rôle imposé, doublon avec casse différente, `/me` avec et sans cookie, jetons `alg: none` / mauvais secret / expiré / utilisateur supprimé, connexion avec un hash PHP du seed, même message pour email inconnu, objet à la place d'une chaîne, JSON mal formé, blocage au 6e échec (429), déconnexion, en-têtes `helmet`.

---

## 7. Villes et trajets (`feat/api-trajets`)

### Routes
| Route | Accès | Rôle |
|---|---|---|
| `GET /api/villes?q=bor` | public | Autocomplétion : villes dont le nom commence par `q` |
| `GET /api/trajets?depart=&arrivee=&date=` | public | Trajets à venir, filtres facultatifs, triés par date |
| `GET /api/trajets/mes-trajets` | connecté | Les trajets que je propose |
| `GET /api/trajets/:id` | connecté | Détail, avec email et téléphone du conducteur |
| `POST /api/trajets` | connecté | Proposer un trajet |
| `DELETE /api/trajets/:id` | connecté | Supprimer **mon** trajet |

### Choix de sécurité
| Risque (relevé dans le projet PHP) | Mesure |
|---|---|
| `places_dispo` envoyé par le client | Jamais lu dans la requête : il est égal à `places_total` à la création |
| Se faire passer pour un autre conducteur | `user_id` jamais lu dans la requête : c'est l'utilisateur connecté |
| Supprimer le trajet de quelqu'un d'autre (IDOR) | `DELETE ... WHERE id = ? AND user_id = ?` ; si rien n'est supprimé : 404 (même réponse que « n'existe pas ») |
| Suppression « silencieuse » du PHP | Le serveur vérifie `affectedRows` et répond 404 si rien n'a été supprimé |
| Coordonnées des conducteurs visibles de tous | Email et téléphone seulement dans le détail, réservé aux utilisateurs connectés |
| Données incohérentes | Validation serveur (villes différentes, dates, 1 à 9 places) **et** contraintes `CHECK` en base |
| Injection SQL | Requêtes préparées (`?`) ; test avec `' OR 1=1 --` dans l'autocomplétion : aucun résultat |
| Mauvais types (texte à la place d'un nombre) | Les villes et les places doivent être de vrais nombres entiers |

### Tests réalisés (jeu d'essai pour le dossier)
37 vérifications automatiques sur une vraie base MariaDB avec le schéma et le seed du projet : autocomplétion, injection SQL, filtres, tri, contacts masqués en public, création valide et 9 cas refusés, valeurs imposées par le serveur, suppression par un autre utilisateur (refusée), par le propriétaire (acceptée).

---

## 8. Réservations (`feat/api-reservations`)

### Routes (toutes réservées aux utilisateurs connectés)
| Route | Rôle |
|---|---|
| `GET /api/reservations` | Mes réservations |
| `POST /api/reservations` `{ "trajet_id": 3 }` | Réserver 1 place |
| `DELETE /api/reservations/:trajetId` | Annuler MA réservation |

### Règles métier vérifiées par le serveur
Trajet existant, pas son propre trajet, pas déjà parti, pas complet, pas déjà réservé. À la réservation `places_dispo` baisse de 1, à l'annulation elle remonte de 1.

### Simplification assumée (à citer dans le dossier)
- **1 réservation = 1 place** (la colonne `nb_places` existe mais vaut toujours 1).
- **Pas de transaction** : si deux personnes réservent la dernière place exactement au même instant, une des deux peut recevoir une erreur serveur. La contrainte `CHECK (places_dispo >= 0)` de la base empêche malgré tout d'avoir un nombre de places négatif. Amélioration possible : transaction SQL + `UPDATE ... WHERE places_dispo >= 1`.
- Annuler une réservation ne fait pas de contrôle de date (on peut annuler un trajet passé).

### Sécurité
Comme pour les trajets, `user_id` vient toujours de la connexion, jamais de la requête : impossible de réserver ou d'annuler à la place de quelqu'un d'autre.

### Tests réalisés
20 vérifications automatiques sur une vraie base MariaDB : accès sans connexion, id invalide, trajet inexistant / à soi / complet / déjà parti, réservation, baisse puis remontée des places, double réservation refusée, annulation de la réservation d'un autre refusée, cohérence de `places_dispo` avec les réservations sur tous les trajets.

---

## 9. Avis et note moyenne — MongoDB (`feat/api-avis`)

### Pourquoi MongoDB pour les avis ?
Un avis est un petit document autonome (note, commentaire, auteur, date) sans lien complexe avec les autres tables, et il est surtout lu et agrégé (moyenne). Le référentiel demande aussi un accès à une base NoSQL : les avis sont le cas d'usage naturel.

### Document dans la collection `avis`
```
{ trajetId: 3, conducteurId: 2, auteurId: 5, auteurPrenom: "Sophie", note: 4, commentaire: "...", createdAt: Date }
```
`conducteurId` et `auteurPrenom` sont copiés au moment de la création (les deux bases ne peuvent pas être jointes) : cela évite de redemander MySQL à chaque affichage.

### Routes
| Route | Accès | Rôle |
|---|---|---|
| `POST /api/avis` `{ trajet_id, note, commentaire }` | connecté | Donner un avis |
| `GET /api/avis/conducteur/:id` | public | Note moyenne, nombre d'avis, liste des 50 derniers |

### Règles métier
- Note entière de 1 à 5, commentaire facultatif de 500 caractères maximum.
- **Seuls les passagers ayant réservé le trajet** peuvent donner un avis (vérifié dans MySQL) : 403 sinon.
- **Un seul avis par passager et par trajet** : garanti par un **index unique MongoDB** `(trajetId, auteurId)`. Une tentative de doublon donne l'erreur 11000, transformée en 409.
- La moyenne est calculée par MongoDB (`aggregate` avec `$group` et `$avg`), arrondie à 1 décimale côté serveur.

### Sécurité
- `conducteurId` vient du trajet en base et `auteurId` de la connexion : jamais de la requête (impossible d'écrire un avis au nom d'un autre ou d'attribuer l'avis à un autre conducteur).
- Types vérifiés : une note ou un commentaire envoyé sous forme d'objet (`{"$gt": 0}`) est refusé, ce qui évite l'injection NoSQL.
- Les identifiants internes (`auteurId`, `conducteurId`, `_id`) ne sont pas renvoyés dans la liste publique.

### Simplification assumée
Il n'y a pas de règle « le trajet doit être terminé » pour donner un avis, ni de modification / suppression d'un avis.

### Tests réalisés
20 vérifications automatiques : accès sans connexion, sans réservation, 8 entrées invalides refusées (note 0, 6, texte, décimale, objet, etc.), avis valide, valeurs imposées par le serveur, doublon refusé, moyenne et liste publiques, conducteur sans avis, identifiant invalide. **Attention : la couche MongoDB a été simulée en mémoire pendant ces tests ; le test réel (Postman + Compass) est à faire et à documenter avec captures.**

---

## 10. Client React — base, connexion et accueil (`feat/client-base`)

### Choix techniques
| Sujet | Choix | Pourquoi |
|---|---|---|
| Outil de build | Vite + React | Démarrage rapide, standard du marché |
| Pages / navigation | `react-router-dom` | Une adresse (URL) = une page, sans rechargement |
| Appels à l'API | `fetch` regroupé dans `src/api.js` | Un seul endroit qui gère le JSON et les erreurs |
| Utilisateur connecté | Contexte React (`AuthContext`) | Toutes les pages connaissent l'utilisateur sans se le passer |
| Style | Un seul fichier CSS avec des variables (couleurs des maquettes) | Pas de bibliothèque à apprendre |
| Liaison avec l'API | **Proxy Vite** : `/api` est redirigé vers `localhost:3000` | Le navigateur ne voit qu'un seul site : le cookie `SameSite=Strict` fonctionne et il n'y a pas de problème CORS en développement |

### Structure
```
client/src/
  api.js                 appels à l'API
  auth/                  contexte de connexion (AuthContext, AuthProvider)
  components/            Header, TrajetCard, VilleInput (autocomplétion)
  pages/                 Accueil, Connexion, Inscription, NotFound
  utils/format.js        affichage des dates
```

### Sécurité côté client
- Le jeton n'est **jamais** manipulé par le JavaScript : il reste dans le cookie `httpOnly` (vérifié par le test : `document.cookie` ne le contient pas). Le client demande `/api/auth/me` pour savoir qui est connecté.
- React échappe automatiquement tout texte affiché : une donnée saisie ne s'exécute pas comme du code (protection XSS). Aucun `dangerouslySetInnerHTML` n'est utilisé.
- Les messages d'erreur affichés viennent de l'API (génériques pour la connexion).
- Les champs ont aussi une validation HTML (`type="email"`, `required`, `minLength`), mais c'est seulement du confort : la vraie validation reste côté serveur.

### Tests réalisés
16 vérifications dans un vrai navigateur (Chromium) avec l'API et la base MariaDB : liste de 12 trajets, trajet complet, autocomplétion, recherche filtrée, mauvais mot de passe, connexion, session conservée après rechargement, cookie `httpOnly` illisible en JavaScript, déconnexion, inscription, email déjà utilisé, page inconnue, affichage mobile sans défilement horizontal, aucune erreur JavaScript. (MongoDB simulé pendant ces tests.)

---

## 11. Client React — trajets, réservations, avis (`feat/client-trajets`)

### Pages ajoutées
| Adresse | Page | Accès |
|---|---|---|
| `/trajets/:id` | Détail : contacts du conducteur, note moyenne, avis, bouton Réserver, formulaire d'avis | connecté |
| `/proposer` | Formulaire de création d'un trajet (autocomplétion des villes) | connecté |
| `/mon-espace` | Mes réservations (annuler) et mes trajets (supprimer) | connecté |

### Choix
- **`RequireAuth`** : un composant qui entoure les pages réservées. Un visiteur est renvoyé vers la connexion, puis revient sur la page qu'il voulait voir.
- **Le formulaire d'avis n'apparaît que si l'utilisateur a réservé le trajet** (le client le sait grâce à `GET /api/reservations`). Ce n'est que du confort : la vraie règle est vérifiée par l'API (403 sinon).
- **Le bouton Réserver est caché** pour son propre trajet et désactivé si le trajet est complet. Même remarque : l'API refuse de toute façon.
- Suppression et annulation : confirmation avec `window.confirm`.
- Rechargement des données après une action : un compteur (`version`) qu'on augmente pour relancer le `useEffect`.

### Sécurité côté client
- Les protections sont **doublées** : le client masque ce qui n'est pas permis, le serveur le refuse réellement.
- Test XSS : un commentaire contenant `<b>gras</b>` est affiché tel quel, en texte (React n'interprète pas le HTML) ; aucun élément `<b>` n'est créé.
- Le message d'erreur du serveur est affiché tel quel (ex. « Vous avez déjà donné votre avis sur ce trajet »).

### Tests réalisés
19 vérifications dans un vrai navigateur (Chromium) : page protégée et retour après connexion, création d'un trajet invalide puis valide, détail avec contacts, réservation (places −1), formulaire d'avis, note moyenne, commentaire HTML non interprété, deuxième avis refusé, annulation, suppression, trajet inexistant, affichage mobile (détail et Mon espace), aucune erreur JavaScript. (MongoDB simulé pendant ces tests.)

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

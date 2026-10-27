# Klaxon v2

Plateforme de covoiturage entre villes : proposer un trajet, rechercher, réserver une place, puis noter le conducteur.

Refonte du projet PHP « Touche pas au Klaxon » avec une stack JavaScript (React + Node/Express), une base relationnelle (MySQL) et une base NoSQL (MongoDB).

## Fonctionnalités

- Inscription, connexion et déconnexion (un seul rôle : utilisateur)
- Recherche de trajets par ville de départ, ville d'arrivée et date, avec autocomplétion des villes
- Proposer un trajet et supprimer ses propres trajets
- Réserver une place (une réservation = une place) et annuler sa réservation
- Donner un avis (note de 1 à 5 + commentaire), **réservé aux passagers du trajet**, puis consulter la note moyenne du conducteur
- Affichage adapté au web et au mobile

## Stack technique

| Partie | Technologie |
|---|---|
| Front-end | React 19, Vite, react-router-dom, CSS |
| Back-end | Node.js, Express 5 |
| Base relationnelle | MySQL / MariaDB (utilisateurs, villes, trajets, réservations) |
| Base NoSQL | MongoDB (avis et notes) |
| Sécurité | bcrypt, JWT dans un cookie httpOnly, helmet, cors, express-rate-limit, requêtes préparées |

## Structure

```
klaxon-v2/
├── client/      Application React (pages, composants, appels à l'API)
├── server/      API Express (routes → contrôleurs → modèles)
├── database/    schema.sql (tables) et seed.sql (jeu de données)
└── NOTES.md     Journal des choix techniques et de sécurité
```

## Installation

### Prérequis

- Node.js 20.19 ou plus récent
- MySQL ou MariaDB (par exemple avec XAMPP)
- Une base MongoDB (MongoDB Atlas, offre gratuite, ou MongoDB en local)

### 1. Récupérer le projet

```
git clone https://github.com/Kochpi/Klaxon-V2.git
cd Klaxon-V2
```

### 2. Créer la base MySQL

Dans phpMyAdmin (ou en ligne de commande), importer **dans cet ordre** :

1. `database/schema.sql` : crée la base `klaxon_v2` et ses 4 tables
2. `database/seed.sql` : ajoute 64 villes, 20 utilisateurs, 14 trajets et leurs réservations

### 3. Lancer l'API

```
cd server
npm install
```

Copier `.env.example` en `.env` puis remplir les valeurs :

- `MYSQL_*` : accès à MySQL (avec XAMPP : utilisateur `root`, mot de passe vide)
- `MONGODB_URI` : chaîne de connexion MongoDB
- `JWT_SECRET` : une longue valeur aléatoire, à générer avec :
  ```
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

Puis :

```
npm run dev
```

On doit voir « MySQL : connecté », « MongoDB : connecté » puis « API démarrée sur http://localhost:3000 ».

### 4. Lancer le client (dans un deuxième terminal)

```
cd client
npm install
npm run dev
```

Ouvrir l'adresse affichée (en général `http://localhost:5173`). Le client envoie les appels `/api` vers l'API grâce au proxy de Vite.

### Comptes de démonstration

Tous les comptes du jeu de données ont le mot de passe `password123`. Par exemple : `sophie.dubois@email.fr`.

## API

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| POST | `/api/auth/register` | public | Créer un compte |
| POST | `/api/auth/login` | public | Se connecter (5 échecs max / 15 min) |
| POST | `/api/auth/logout` | public | Se déconnecter |
| GET | `/api/auth/me` | connecté | Utilisateur connecté |
| GET | `/api/villes?q=` | public | Autocomplétion des villes |
| GET | `/api/trajets` | public | Trajets à venir (filtres `depart`, `arrivee`, `date`) |
| GET | `/api/trajets/mes-trajets` | connecté | Mes trajets |
| GET | `/api/trajets/:id` | connecté | Détail d'un trajet (avec les contacts du conducteur) |
| POST | `/api/trajets` | connecté | Proposer un trajet |
| DELETE | `/api/trajets/:id` | connecté | Supprimer son trajet |
| GET | `/api/reservations` | connecté | Mes réservations |
| POST | `/api/reservations` | connecté | Réserver une place |
| DELETE | `/api/reservations/:trajetId` | connecté | Annuler sa réservation |
| POST | `/api/avis` | connecté (passager) | Donner un avis |
| GET | `/api/avis/conducteur/:id` | public | Note moyenne et avis d'un conducteur |
| GET | `/api/health` | public | État de l'API et des deux bases |

## Sécurité (résumé)

- Mots de passe hachés avec bcrypt ; jamais renvoyés par l'API
- Session : JWT dans un cookie `httpOnly` + `SameSite=Strict` (illisible par JavaScript)
- Requêtes SQL préparées ; colonnes listées une par une (pas de `SELECT *`)
- Contraintes d'intégrité en base (`CHECK`, clés uniques, clés étrangères)
- Limitation des tentatives de connexion ; en-têtes HTTP sécurisés (helmet) ; CORS limité au site du client
- Droits vérifiés côté serveur : on ne peut supprimer que ses trajets et annuler que ses réservations ; seuls les passagers peuvent noter
- Index unique MongoDB : un seul avis par passager et par trajet

Le détail des choix et de leurs justifications est dans [NOTES.md](NOTES.md).

## Limites connues

- Une réservation = une place ; pas de transaction SQL pour la dernière place (deux réservations simultanées peuvent provoquer une erreur)
- Un seul rôle (l'ajout d'un rôle administrateur est une piste d'évolution)
- Application prévue pour un hébergement local pour le moment

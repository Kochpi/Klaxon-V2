-- ============================================
-- Klaxon v2 - Covoiturage
-- Schéma de la base de données (MySQL / MariaDB)
-- ============================================

CREATE DATABASE IF NOT EXISTS klaxon_v2
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE klaxon_v2;

-- Suppression dans l'ordre inverse des dépendances (réexécution possible en dev)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS trajets;
DROP TABLE IF EXISTS villes;
DROP TABLE IF EXISTS users;

-- ============================================
-- Utilisateurs
-- Le champ role est conservé (évolution admin possible)
-- mais n'est pas exploité dans la version présentée.
-- ============================================
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    prenom      VARCHAR(100) NOT NULL,
    telephone   VARCHAR(20)  NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- ============================================
-- Villes (ex-agencies)
-- Le département distingue les homonymes et
-- enrichit l'autocomplétion.
-- ============================================
CREATE TABLE villes (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    departement   VARCHAR(3)   NOT NULL,

    UNIQUE KEY uq_ville_departement (nom, departement),
    INDEX idx_villes_nom (nom)
);

-- ============================================
-- Trajets
-- places_dispo est géré uniquement par le serveur
-- (transaction lors des réservations / annulations).
-- ============================================
CREATE TABLE trajets (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    ville_depart_id     INT      NOT NULL,
    ville_arrivee_id    INT      NOT NULL,
    date_depart         DATETIME NOT NULL,
    date_arrivee        DATETIME NOT NULL,
    places_total        INT      NOT NULL,
    places_dispo        INT      NOT NULL,
    user_id             INT      NOT NULL,

    FOREIGN KEY (ville_depart_id)  REFERENCES villes(id),
    FOREIGN KEY (ville_arrivee_id) REFERENCES villes(id),
    FOREIGN KEY (user_id)          REFERENCES users(id),

    -- Garde-fous en base (défense en profondeur, en plus du code serveur)
    CONSTRAINT chk_villes_differentes CHECK (ville_depart_id <> ville_arrivee_id),
    CONSTRAINT chk_dates_coherentes   CHECK (date_arrivee > date_depart),
    CONSTRAINT chk_places_total       CHECK (places_total BETWEEN 1 AND 9),
    CONSTRAINT chk_places_dispo       CHECK (places_dispo >= 0 AND places_dispo <= places_total),

    INDEX idx_trajets_date_depart (date_depart),
    INDEX idx_trajets_villes (ville_depart_id, ville_arrivee_id)
);

-- ============================================
-- Réservations
-- Un passager ne peut réserver qu'une fois le même trajet.
-- Si le trajet est supprimé, ses réservations le sont aussi.
-- ============================================
CREATE TABLE reservations (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    trajet_id   INT      NOT NULL,
    user_id     INT      NOT NULL,
    nb_places   INT      NOT NULL DEFAULT 1,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trajet_id) REFERENCES trajets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,

    UNIQUE KEY uq_reservation_user_trajet (user_id, trajet_id),
    CONSTRAINT chk_nb_places CHECK (nb_places >= 1)
);

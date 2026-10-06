-- ============================================
-- Klaxon v2 - Jeu de données de démonstration
-- À exécuter APRÈS schema.sql
-- Mot de passe de tous les comptes : password123
-- (hash bcrypt, compatible avec la bibliothèque bcrypt de Node)
-- ============================================

USE klaxon_v2;

-- ============================================
-- Villes
-- ============================================
INSERT INTO villes (nom, departement) VALUES
('Paris', '75'), ('Lyon', '69'), ('Marseille', '13'), ('Toulouse', '31'),
('Nice', '06'), ('Nantes', '44'), ('Strasbourg', '67'), ('Montpellier', '34'),
('Bordeaux', '33'), ('Lille', '59'), ('Rennes', '35'), ('Reims', '51'),
('Nevers', '58'), ('Grenoble', '38'), ('Dijon', '21'), ('Angers', '49'),
('Le Mans', '72'), ('Clermont-Ferrand', '63'), ('Tours', '37'), ('Limoges', '87'),
('Amiens', '80'), ('Metz', '57'), ('Besançon', '25'), ('Orléans', '45'),
('Rouen', '76'), ('Caen', '14'), ('Mulhouse', '68'), ('Perpignan', '66'),
('Nîmes', '30'), ('Avignon', '84'), ('Saint-Étienne', '42'), ('Toulon', '83'),
('Brest', '29'), ('Le Havre', '76'), ('Poitiers', '86'), ('La Rochelle', '17'),
('Pau', '64'), ('Bayonne', '64'), ('Annecy', '74'), ('Chambéry', '73'),
('Valence', '26'), ('Montauban', '82'), ('Albi', '81'), ('Carcassonne', '11'),
('Cannes', '06'), ('Antibes', '06'), ('Nancy', '54'), ('Troyes', '10'),
('Chartres', '28'), ('Lorient', '56'), ('Vannes', '56'), ('Quimper', '29'),
('Saint-Malo', '35'), ('Cherbourg', '50'), ('Angoulême', '16'), ('Niort', '79'),
('Bourges', '18'), ('Châteauroux', '36'), ('Vichy', '03'), ('Aurillac', '15'),
('Rodez', '12'), ('Tarbes', '65'), ('Ajaccio', '2A'), ('Bastia', '2B');

-- ============================================
-- Utilisateurs
-- ============================================
INSERT INTO users (nom, prenom, telephone, email, password, role) VALUES
('Martin',    'Alexandre', '0612345678', 'alexandre.martin@email.fr',   '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'admin'),
('Dubois',    'Sophie',    '0698765432', 'sophie.dubois@email.fr',      '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Bernard',   'Julien',    '0622446688', 'julien.bernard@email.fr',     '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Moreau',    'Camille',   '0611223344', 'camille.moreau@email.fr',     '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Lefèvre',   'Lucie',     '0777889900', 'lucie.lefevre@email.fr',      '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Leroy',     'Thomas',    '0655443322', 'thomas.leroy@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Roux',      'Chloé',     '0633221199', 'chloe.roux@email.fr',         '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Petit',     'Maxime',    '0766778899', 'maxime.petit@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Garnier',   'Laura',     '0688776655', 'laura.garnier@email.fr',      '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Dupuis',    'Antoine',   '0744556677', 'antoine.dupuis@email.fr',     '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Lefebvre',  'Emma',      '0699887766', 'emma.lefebvre@email.fr',      '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Fontaine',  'Louis',     '0655667788', 'louis.fontaine@email.fr',     '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Chevalier', 'Clara',     '0788990011', 'clara.chevalier@email.fr',    '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Robin',     'Nicolas',   '0644332211', 'nicolas.robin@email.fr',      '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Gauthier',  'Marine',    '0677889922', 'marine.gauthier@email.fr',    '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Fournier',  'Pierre',    '0722334455', 'pierre.fournier@email.fr',    '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Girard',    'Sarah',     '0688665544', 'sarah.girard@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Lambert',   'Hugo',      '0611223366', 'hugo.lambert@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Masson',    'Julie',     '0733445566', 'julie.masson@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user'),
('Henry',     'Arthur',    '0666554433', 'arthur.henry@email.fr',       '$2y$10$eNMhv7TQnp1586jp1jn.tO9gIr1kafA01gvmygUxiS6ywcQuKqPVi', 'user');

-- ============================================
-- Trajets
-- Dates RELATIVES à la date d'exécution : le seed reste valable
-- quel que soit le jour où on le charge.
-- Les 2 premiers trajets sont passés (ils servent aux avis).
-- places_dispo est recalculé plus bas à partir des réservations.
-- ============================================
INSERT INTO trajets
    (ville_depart_id, ville_arrivee_id, date_depart, date_arrivee, places_total, places_dispo, user_id)
VALUES
-- Trajets passés (ids 1 et 2)
((SELECT id FROM villes WHERE nom = 'Paris'),
 (SELECT id FROM villes WHERE nom = 'Lyon'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL -10 DAY), INTERVAL '08:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL -10 DAY), INTERVAL '12:00' HOUR_MINUTE), 4, 4, 2),
((SELECT id FROM villes WHERE nom = 'Lyon'),
 (SELECT id FROM villes WHERE nom = 'Marseille'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL -5 DAY), INTERVAL '09:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL -5 DAY), INTERVAL '13:30' HOUR_MINUTE), 3, 3, 3),
-- Trajets à venir (ids 3 à 14)
((SELECT id FROM villes WHERE nom = 'Paris'),
 (SELECT id FROM villes WHERE nom = 'Lyon'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 2 DAY), INTERVAL '08:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 2 DAY), INTERVAL '12:00' HOUR_MINUTE), 4, 4, 2),
((SELECT id FROM villes WHERE nom = 'Lyon'),
 (SELECT id FROM villes WHERE nom = 'Marseille'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 3 DAY), INTERVAL '09:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 3 DAY), INTERVAL '13:30' HOUR_MINUTE), 3, 3, 3),
((SELECT id FROM villes WHERE nom = 'Marseille'),
 (SELECT id FROM villes WHERE nom = 'Toulouse'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 4 DAY), INTERVAL '07:30' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 4 DAY), INTERVAL '11:00' HOUR_MINUTE), 5, 5, 4),
((SELECT id FROM villes WHERE nom = 'Paris'),
 (SELECT id FROM villes WHERE nom = 'Nice'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 5 DAY), INTERVAL '06:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 5 DAY), INTERVAL '15:00' HOUR_MINUTE), 4, 4, 5),
((SELECT id FROM villes WHERE nom = 'Nantes'),
 (SELECT id FROM villes WHERE nom = 'Paris'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 6 DAY), INTERVAL '14:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 6 DAY), INTERVAL '18:30' HOUR_MINUTE), 3, 3, 6),
((SELECT id FROM villes WHERE nom = 'Toulouse'),
 (SELECT id FROM villes WHERE nom = 'Bordeaux'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 7 DAY), INTERVAL '08:30' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 7 DAY), INTERVAL '11:00' HOUR_MINUTE), 4, 4, 7),
((SELECT id FROM villes WHERE nom = 'Lyon'),
 (SELECT id FROM villes WHERE nom = 'Paris'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 8 DAY), INTERVAL '07:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 8 DAY), INTERVAL '11:00' HOUR_MINUTE), 5, 5, 8),
((SELECT id FROM villes WHERE nom = 'Lille'),
 (SELECT id FROM villes WHERE nom = 'Reims'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 DAY), INTERVAL '10:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 9 DAY), INTERVAL '12:30' HOUR_MINUTE), 4, 4, 9),
((SELECT id FROM villes WHERE nom = 'Rennes'),
 (SELECT id FROM villes WHERE nom = 'Nantes'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 10 DAY), INTERVAL '17:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 10 DAY), INTERVAL '19:00' HOUR_MINUTE), 3, 3, 10),
((SELECT id FROM villes WHERE nom = 'Montpellier'),
 (SELECT id FROM villes WHERE nom = 'Nice'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 11 DAY), INTERVAL '09:30' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 11 DAY), INTERVAL '13:30' HOUR_MINUTE), 4, 4, 11),
((SELECT id FROM villes WHERE nom = 'Bordeaux'),
 (SELECT id FROM villes WHERE nom = 'Paris'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 12 DAY), INTERVAL '06:30' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 12 DAY), INTERVAL '12:00' HOUR_MINUTE), 4, 4, 12),
((SELECT id FROM villes WHERE nom = 'Strasbourg'),
 (SELECT id FROM villes WHERE nom = 'Lyon'),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 14 DAY), INTERVAL '08:00' HOUR_MINUTE),
 DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 14 DAY), INTERVAL '14:00' HOUR_MINUTE), 3, 3, 13);

-- ============================================
-- Réservations
-- Aucun conducteur ne réserve son propre trajet.
-- ============================================
INSERT INTO reservations (trajet_id, user_id, nb_places) VALUES
-- Trajet 1 (passé, Paris -> Lyon) : complet
(1, 9, 1), (1, 10, 2), (1, 11, 1),
-- Trajet 2 (passé, Lyon -> Marseille)
(2, 12, 1), (2, 13, 1),
-- Trajet 3 (Paris -> Lyon)
(3, 14, 1), (3, 15, 1),
-- Trajet 4 (Lyon -> Marseille) : complet, pour tester le refus
(4, 16, 2), (4, 17, 1),
-- Trajet 6 (Paris -> Nice)
(6, 18, 1),
-- Trajet 7 (Nantes -> Paris)
(7, 19, 1), (7, 20, 1),
-- Trajet 9 (Lyon -> Paris)
(9, 2, 2),
-- Trajet 12 (Montpellier -> Nice)
(12, 3, 1);

-- ============================================
-- Cohérence : places_dispo = places_total - places réservées
-- ============================================
UPDATE trajets t
SET t.places_dispo = t.places_total - COALESCE(
    (SELECT SUM(r.nb_places) FROM reservations r WHERE r.trajet_id = t.id), 0);

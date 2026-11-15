-- Local development schema, reconstructed from the queries in src/lib (the production schema is not in the repo)
-- plus apps/backend/migrations/15_06_2025_migration.sql of the old project.
-- Runs automatically on the first start of the docker-compose MariaDB (empty volume only).

SET NAMES utf8mb4;

CREATE TABLE `uzytkownicy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(64) NOT NULL,
  `haslo` varchar(41) NOT NULL COMMENT 'MariaDB PASSWORD() hash',
  `imie` varchar(255) NULL,
  `nazwisko` varchar(255) NULL,
  `status` enum('AKTYWNY','NIEAKTYWNY') NOT NULL DEFAULT 'AKTYWNY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `warsztaty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) NOT NULL,
  `max_osob` int(11) NOT NULL DEFAULT 1,
  `sloty` int(11) NOT NULL DEFAULT 1 COMMENT 'number of 1h calendar slots a booking takes',
  `cena` decimal(10,2) NOT NULL DEFAULT 0,
  `czas` int(11) NOT NULL DEFAULT 60 COMMENT 'minutes',
  `status` enum('AKTYWNY','NIEAKTYWNY') NOT NULL DEFAULT 'AKTYWNY',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `klienci` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imie_nazwisko` varchar(255) NOT NULL,
  `imie` varchar(255) NULL,
  `nazwisko` varchar(255) NULL,
  `telefon` varchar(32) NULL,
  `email` varchar(255) NULL,
  `ulica` varchar(255) NULL,
  `numer_domu` varchar(32) NULL,
  `numer_mieszkania` varchar(32) NULL,
  `kod_pocztowy` varchar(6) NULL,
  `miasto` varchar(255) NULL,
  `status` enum('AKTYWNY','NIEAKTYWNY') NOT NULL DEFAULT 'AKTYWNY',
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `voucher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `klient` int(11) NOT NULL,
  `od` varchar(255) NOT NULL,
  `dla` varchar(255) NOT NULL,
  `rodzaj` varchar(16) NOT NULL COMMENT 'WARSZTAT | KWOTA',
  `warsztat` int(11) NULL,
  `kwota` decimal(10,2) NULL,
  `kwota_wykorzystana` decimal(10,2) NOT NULL DEFAULT 0,
  `status` enum('AKTYWNY','NIEAKTYWNY','WYKORZYSTANY','CZĘŚCIOWO_WYKORZYSTANY') NOT NULL,
  `uwagi` text NULL,
  `kod` varchar(32) NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `czy_platnosc` tinyint(4) NOT NULL DEFAULT 0,
  `identyfikator_platnosci` varchar(255) NULL,
  `data_zakupu` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kod` (`kod`),
  KEY `klient` (`klient`),
  KEY `data_zakupu` (`data_zakupu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `zapisy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `klient` int(11) NOT NULL,
  `ile_osob` int(11) NOT NULL DEFAULT 1,
  `warsztat` int(11) NOT NULL,
  `mam_voucher` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('AKTYWNY','NIEAKTYWNY') NOT NULL DEFAULT 'AKTYWNY',
  `uwagi` text NULL,
  `data` date NOT NULL,
  `godzina` time NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `zrodlo_zapisu` varchar(16) NULL COMMENT 'ONLINE | ADMIN',
  `voucher_id` int(11) NOT NULL DEFAULT 0,
  `oplacony` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 unpaid, 1 deposit, 2 voucher, 3 settled, 4 voucher + top-up due',
  `zaliczka` double(10,2) NULL DEFAULT 0,
  `kwota_vouchera` decimal(10,2) NULL DEFAULT 0,
  `cena` decimal(10,2) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `data` (`data`, `status`),
  KEY `klient` (`klient`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `platnosci` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `json_platnosc` longtext NOT NULL,
  `rodzaj` varchar(4) NOT NULL COMMENT 'T booking | V voucher',
  `id_w_tabeli` int(11) NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `data2` date NOT NULL DEFAULT (curdate()),
  `godzina` time NOT NULL DEFAULT (curtime()),
  PRIMARY KEY (`id`),
  KEY `data2` (`data2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `doplaty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_w_tabeli` int(11) NOT NULL COMMENT 'zapisy.id',
  `kwota` decimal(10,2) NOT NULL,
  `data` date NOT NULL DEFAULT (curdate()),
  `godzina` time NOT NULL DEFAULT (curtime()),
  PRIMARY KEY (`id`),
  KEY `data` (`data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- dzien: Monday = 0 … Sunday = 6 (MySQL WEEKDAY()); NULL hours = closed. All 7 rows must exist (the admin screen UPDATEs them).
CREATE TABLE `godziny_pracy` (
  `dzien` tinyint(4) NOT NULL,
  `godzina_od` time NULL,
  `godzina_do` time NULL,
  PRIMARY KEY (`dzien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `przerwy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dzien` int(11) NOT NULL,
  `godzina_od` time NOT NULL,
  `godzina_do` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dzien` (`dzien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tytul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `data_utworzenia` datetime NOT NULL DEFAULT current_timestamp(),
  `tresc` longtext NOT NULL,
  `status` enum('AKTYWNY','NIEAKTYWNY') NOT NULL DEFAULT 'AKTYWNY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `status` (`status`),
  KEY `data_utworzenia` (`data_utworzenia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `blog_pliki` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blog_id` int(11) NOT NULL,
  `url_pliku` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_id` (`blog_id`),
  CONSTRAINT `blog_pliki_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `Galeria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src` varchar(100) NOT NULL,
  `alt` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `size` enum('tall','wide','small','medium','large','small-wide','small-tall','medium-wide','medium-tall') NOT NULL DEFAULT 'small',
  `link_url` varchar(255) NULL,
  `link_tytul` varchar(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

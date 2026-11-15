-- Minimum data the app needs to work locally. Local development only — never run against production.

SET NAMES utf8mb4;

-- Admin panel login (/olimp): admin / admin
INSERT INTO `uzytkownicy` (`login`, `haslo`, `imie`, `nazwisko`, `status`) VALUES
  ('admin', PASSWORD('admin'), 'Admin', 'Lokalny', 'AKTYWNY');

-- Ids must match workshopId in src/modules/Workshop/workshops.data.tsx; prices/limits follow the page texts.
-- 'GRUPY ZORGANIZOWANE' must keep this exact name (group price is not multiplied by persons).
INSERT INTO `warsztaty` (`id`, `nazwa`, `max_osob`, `sloty`, `cena`, `czas`, `status`) VALUES
  (1, 'KURS OD ZERA',        2,  3,  850.00, 180, 'AKTYWNY'),
  (2, 'LEKCJA TOCZENIA',     2,  2,  250.00, 120, 'AKTYWNY'),
  (3, 'LEKCJA LEPIENIA',     5,  2,  180.00, 120, 'AKTYWNY'),
  (4, 'LEKCJA SZKLIWIENIA',  5,  2,  180.00, 120, 'AKTYWNY'),
  (5, 'SZLIF CERAMICZNY',    2,  3, 1200.00, 180, 'AKTYWNY'),
  (6, 'GRUPY ZORGANIZOWANE', 15, 3,    0.00, 180, 'AKTYWNY');

-- Opening hours (Mon–Fri 10–20, Sat 10–16, Sun closed); change them in /olimp → grafik.
INSERT INTO `godziny_pracy` (`dzien`, `godzina_od`, `godzina_do`) VALUES
  (0, '10:00:00', '20:00:00'),
  (1, '10:00:00', '20:00:00'),
  (2, '10:00:00', '20:00:00'),
  (3, '10:00:00', '20:00:00'),
  (4, '10:00:00', '20:00:00'),
  (5, '10:00:00', '16:00:00'),
  (6, NULL, NULL);

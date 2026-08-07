-- =============================================================
-- 007_add_new_tags.sql
-- Add missing Looker/Looker Studio tags to MercadoLibre roles
-- and first tags for Sociology degree and Teaching degree.
-- Run in Supabase SQL Editor.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Looker Studio / Looker — MercadoLibre analytical positions
--    exp_id=1  Data & Analytics Technical Leader  (Jan 2025 – present)
--    exp_id=2  Sr. Data & Analytics Engineer      (Dec 2023 – Feb 2025)
--    exp_id=3  Shipping Product Owner             (May 2022 – Dec 2023)
--    exp_id=4  Cross Docking Sr. Analyst          (Jan 2021 – Jun 2022)
-- -------------------------------------------------------------
INSERT INTO experience_tags (experience_id, tag) VALUES
  (1, 'Looker Studio'),
  (2, 'Looker Studio'),
  (3, 'Looker'),
  (3, 'Looker Studio'),
  (4, 'Looker'),
  (4, 'Looker Studio');

-- -------------------------------------------------------------
-- 2. Licenciatura en Sociología — education_id = 3 (UBA, 2007-2014)
-- -------------------------------------------------------------
INSERT INTO education_tags (education_id, tag) VALUES
  (3, 'SPSS'),
  (3, 'Estadística'),
  (3, 'Probabilidad'),
  (3, 'Método Científico'),
  (3, 'Métodos Cuantitativos'),
  (3, 'Métodos Cualitativos'),
  (3, 'Sociología Económica'),
  (3, 'Pensamiento Crítico'),
  (3, 'Out of the Box Thinking');

-- -------------------------------------------------------------
-- 3. Profesorado en Sociología — education_id = 4 (UBA, 2014-2015)
-- -------------------------------------------------------------
INSERT INTO education_tags (education_id, tag) VALUES
  (4, 'Pedagogía'),
  (4, 'Didáctica'),
  (4, 'Tecnologías Aplicadas para Educación'),
  (4, 'Pensamiento Crítico'),
  (4, 'Out of the Box Thinking');

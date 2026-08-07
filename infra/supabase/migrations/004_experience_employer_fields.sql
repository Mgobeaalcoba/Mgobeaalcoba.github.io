-- =============================================================
-- 004_experience_employer_fields.sql
-- Adds company_logo, start_date, end_date to experience table.
-- Also syncs ep_history_timeline with bilingual title+description.
-- Run in Supabase SQL editor AFTER 003_migrate_ai_models_feb2026.sql
-- =============================================================

-- ─── 1. experience — new columns ─────────────────────────────
ALTER TABLE experience
  ADD COLUMN IF NOT EXISTS company_logo TEXT,
  ADD COLUMN IF NOT EXISTS start_date   DATE,
  ADD COLUMN IF NOT EXISTS end_date     DATE;

-- ─── 2. Populate dates and logos ─────────────────────────────
-- Mercado Libre
UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2025-01-01',
  end_date     = NULL
WHERE id = 1;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2023-12-01',
  end_date     = '2025-02-01'
WHERE id = 2;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2022-05-01',
  end_date     = '2023-12-01'
WHERE id = 3;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2021-01-01',
  end_date     = '2022-06-01'
WHERE id = 4;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2020-08-01',
  end_date     = '2021-01-01'
WHERE id = 5;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/mercadolibre.com',
  start_date   = '2019-05-01',
  end_date     = '2020-08-01'
WHERE id = 6;

-- Henry
UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/soyhenry.com',
  start_date   = '2026-02-01',
  end_date     = NULL
WHERE id = 13;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/soyhenry.com',
  start_date   = '2025-10-01',
  end_date     = NULL
WHERE id = 14;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/soyhenry.com',
  start_date   = '2024-12-01',
  end_date     = '2026-02-01'
WHERE id = 7;

UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/soyhenry.com',
  start_date   = '2024-05-01',
  end_date     = NULL
WHERE id = 8;

-- UADE
UPDATE experience SET
  company_logo = 'https://logo.clearbit.com/uade.edu.ar',
  start_date   = '2024-07-01',
  end_date     = NULL
WHERE id = 9;

-- El Portugues
UPDATE experience SET
  company_logo = 'https://elportuguessa.com.ar/wp-content/uploads/2024/07/logo-el-protugues-footer.png',
  start_date   = '2011-02-01',
  end_date     = '2019-02-01'
WHERE id = 10;

-- SOLDA-LIMP S.R.L.
UPDATE experience SET
  company_logo = NULL,
  start_date   = '2010-01-01',
  end_date     = '2011-02-01'
WHERE id = 11;

-- UBICAR ARGENTINA
UPDATE experience SET
  company_logo = NULL,
  start_date   = '2009-02-01',
  end_date     = '2009-12-01'
WHERE id = 12;

-- ─── 3. ep_history_timeline — add bilingual title + description ──
ALTER TABLE ep_history_timeline
  ADD COLUMN IF NOT EXISTS title_es       TEXT,
  ADD COLUMN IF NOT EXISTS title_en       TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- ─── 4. Populate timeline content (match by year) ────────────
UPDATE ep_history_timeline SET
  title_es       = 'Los inicios',
  title_en       = 'The Beginnings',
  description_es = 'Nuestra historia se inicia con el sueño de Don Tomás Viegas, inmigrante portugués, quien comenzó como chofer en la empresa de su cuñado Manuel Machadinho (M&M).',
  description_en = 'Our history begins with the dream of Don Tomás Viegas, a Portuguese immigrant who started as a driver at his brother-in-law Manuel Machadinho''s company (M&M).'
WHERE year = '1927';

UPDATE ep_history_timeline SET
  title_es       = 'Primer contrato',
  title_en       = 'First Contract',
  description_es = 'Don Tomás comenzó a trabajar para la Elaboradora Argentina de Cereales, que luego pasó a manos de The Quaker Oats Company. Con un préstamo de la compañía, compró su primer camión Chevrolet ''46.',
  description_en = 'Don Tomás started working for the Argentine Cereal Processor, which later became The Quaker Oats Company. With a company loan, he bought his first Chevrolet ''46 truck.'
WHERE year = '1937';

UPDATE ep_history_timeline SET
  title_es       = 'Formalización',
  title_en       = 'Formalization',
  description_es = 'Se formaliza la empresa como ''El Portugués'', consolidándose con un pequeño depósito y flota propia de camiones Dodge 600 y 800.',
  description_en = 'The company was formally established as ''El Portugués'', consolidating with a small warehouse and its own fleet of Dodge 600 and 800 trucks.'
WHERE year = '1972';

UPDATE ep_history_timeline SET
  title_es       = 'Expansión con Arcor',
  title_en       = 'Expansion with Arcor',
  description_es = 'Respaldados por la trayectoria junto a Quaker, comenzamos a trabajar para Arcor, obteniendo la distribución total de sus productos en la región.',
  description_en = 'Backed by our track record with Quaker, we began working for Arcor, securing the full distribution of their products in the region.'
WHERE year = '1976';

UPDATE ep_history_timeline SET
  title_es       = 'Nueva generación',
  title_en       = 'New Generation',
  description_es = 'Néstor y Walter Viegas, nietos de Don Tomás, comienzan su camino como choferes de sus propias unidades, incorporando la tercera generación al negocio familiar.',
  description_en = 'Néstor and Walter Viegas, grandsons of Don Tomás, began their journey as drivers of their own units, bringing the third generation into the family business.'
WHERE year = '1993';

UPDATE ep_history_timeline SET
  title_es       = 'Certificación ISO 9001',
  title_en       = 'ISO 9001 Certification',
  description_es = 'Obtención de la certificación ISO 9001:2015, consolidando el compromiso con la calidad y la mejora continua en todos los procesos.',
  description_en = 'Obtaining the ISO 9001:2015 certification, consolidating the commitment to quality and continuous improvement across all processes.'
WHERE year = '2015';

UPDATE ep_history_timeline SET
  title_es       = 'Líderes en logística',
  title_en       = 'Logistics Leaders',
  description_es = 'Cuatro generaciones después, El Portugués S.A. opera una flota de más de 70 equipos y 8.200 m² de depósito, sirviendo a los clientes más exigentes del mercado.',
  description_en = 'Four generations later, El Portugués S.A. operates a fleet of more than 70 vehicles and 8,200 m² of warehouse space, serving the most demanding clients in the market.'
WHERE year = 'HOY';

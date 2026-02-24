-- =============================================================
-- 005_fix_logos_and_ep_timeline.sql
-- 1. Update company_logo paths to self-hosted assets (/logos/)
-- 2. Ensure ep_history_timeline has bilingual content (idempotent)
-- Run in Supabase SQL editor AFTER 004_experience_employer_fields.sql
-- =============================================================

-- ─── 1. Update company_logo to self-hosted paths ─────────────
-- Mercado Libre
UPDATE experience
SET company_logo = '/logos/mercadolibre.png'
WHERE company = 'Mercado Libre';

-- Henry
UPDATE experience
SET company_logo = '/logos/henry.svg'
WHERE company = 'Henry';

-- UADE
UPDATE experience
SET company_logo = '/logos/uade.png'
WHERE company = 'UADE';

-- El Portugues
UPDATE experience
SET company_logo = '/logos/elportugues.png'
WHERE company = 'El Portugues';

-- SOLDA-LIMP S.R.L.
UPDATE experience
SET company_logo = '/logos/soldalimp.svg'
WHERE company = 'SOLDA-LIMP S.R.L.';

-- UBICAR ARGENTINA
UPDATE experience
SET company_logo = '/logos/ubicar.svg'
WHERE company = 'UBICAR ARGENTINA';

-- ─── 2. Ensure ep_history_timeline columns exist ─────────────
ALTER TABLE ep_history_timeline
  ADD COLUMN IF NOT EXISTS title_es       TEXT,
  ADD COLUMN IF NOT EXISTS title_en       TEXT,
  ADD COLUMN IF NOT EXISTS description_es TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- ─── 3. Upsert bilingual content (idempotent) ────────────────
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

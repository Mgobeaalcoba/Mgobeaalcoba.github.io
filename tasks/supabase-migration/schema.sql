-- =============================================================================
-- Supabase Migration Schema
-- mgobeaalcoba.github.io — PostgreSQL via Supabase
--
-- Run this entire script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- BEFORE importing any CSVs.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXPERIENCE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id             INT PRIMARY KEY,
  date_es        TEXT NOT NULL,
  date_en        TEXT NOT NULL,
  title_es       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  company        TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  sort_order     INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience_tags (
  id             SERIAL PRIMARY KEY,
  experience_id  INT  NOT NULL,
  tag            TEXT NOT NULL,
  CONSTRAINT fk_experience_tags FOREIGN KEY (experience_id)
    REFERENCES experience (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_experience_tags_exp ON experience_tags (experience_id);

-- ---------------------------------------------------------------------------
-- 2. PROJECTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id             INT PRIMARY KEY,
  title_es       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  link           TEXT NOT NULL DEFAULT '',
  sort_order     INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_tags (
  id         SERIAL PRIMARY KEY,
  project_id INT  NOT NULL,
  tag        TEXT NOT NULL,
  CONSTRAINT fk_project_tags FOREIGN KEY (project_id)
    REFERENCES projects (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_tags_proj ON project_tags (project_id);

-- ---------------------------------------------------------------------------
-- 3. EDUCATION
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id          SERIAL PRIMARY KEY,
  title_es    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  school      TEXT NOT NULL,
  date        TEXT NOT NULL,
  subtitle_es TEXT,
  subtitle_en TEXT,
  sort_order  INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education_tags (
  id           SERIAL PRIMARY KEY,
  education_id INT  NOT NULL,
  tag          TEXT NOT NULL,
  CONSTRAINT fk_education_tags FOREIGN KEY (education_id)
    REFERENCES education (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_education_tags_edu ON education_tags (education_id);

-- ---------------------------------------------------------------------------
-- 4. CERTIFICATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certification_tags (
  id               SERIAL PRIMARY KEY,
  certification_id INT  NOT NULL,
  tag              TEXT NOT NULL,
  CONSTRAINT fk_certification_tags FOREIGN KEY (certification_id)
    REFERENCES certifications (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cert_tags_cert ON certification_tags (certification_id);

-- ---------------------------------------------------------------------------
-- 5. CONSULTING PACKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consulting_packs (
  id             TEXT PRIMARY KEY,
  name_es        TEXT    NOT NULL,
  name_en        TEXT    NOT NULL,
  subtitle_es    TEXT    NOT NULL,
  subtitle_en    TEXT    NOT NULL,
  description_es TEXT    NOT NULL,
  description_en TEXT    NOT NULL,
  price_es       TEXT    NOT NULL,
  price_en       TEXT    NOT NULL,
  highlighted    BOOLEAN NOT NULL DEFAULT FALSE,
  badge_es       TEXT,
  badge_en       TEXT,
  sort_order     INT     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS consulting_pack_features (
  id         SERIAL PRIMARY KEY,
  pack_id    TEXT NOT NULL,
  text_es    TEXT NOT NULL,
  text_en    TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0,
  CONSTRAINT fk_pack_features FOREIGN KEY (pack_id)
    REFERENCES consulting_packs (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pack_features_pack ON consulting_pack_features (pack_id);

CREATE TABLE IF NOT EXISTS consulting_pack_automations (
  id         SERIAL PRIMARY KEY,
  pack_id    TEXT NOT NULL,
  text_es    TEXT NOT NULL,
  text_en    TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0,
  CONSTRAINT fk_pack_automations FOREIGN KEY (pack_id)
    REFERENCES consulting_packs (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pack_automations_pack ON consulting_pack_automations (pack_id);

-- ---------------------------------------------------------------------------
-- 6. CONSULTING CASE STUDIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consulting_case_studies (
  id             TEXT PRIMARY KEY,
  title_es       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  result_es      TEXT NOT NULL,
  result_en      TEXT NOT NULL,
  image          TEXT NOT NULL DEFAULT '',
  sort_order     INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS consulting_case_study_tags (
  id            SERIAL PRIMARY KEY,
  case_study_id TEXT NOT NULL,
  tag           TEXT NOT NULL,
  CONSTRAINT fk_case_study_tags FOREIGN KEY (case_study_id)
    REFERENCES consulting_case_studies (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cs_tags_cs ON consulting_case_study_tags (case_study_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Enable RLS then grant anon read-only access on every table.
-- =============================================================================

ALTER TABLE experience                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags                ENABLE ROW LEVEL SECURITY;
ALTER TABLE education                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_tags              ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_packs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_pack_features    ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_pack_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_case_studies     ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_case_study_tags  ENABLE ROW LEVEL SECURITY;

-- Public (anon) SELECT policies — no write access ever
CREATE POLICY "anon_read_experience"
  ON experience FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_experience_tags"
  ON experience_tags FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_projects"
  ON projects FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_project_tags"
  ON project_tags FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_education"
  ON education FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_education_tags"
  ON education_tags FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_certifications"
  ON certifications FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_certification_tags"
  ON certification_tags FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_consulting_packs"
  ON consulting_packs FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_pack_features"
  ON consulting_pack_features FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_pack_automations"
  ON consulting_pack_automations FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_case_studies"
  ON consulting_case_studies FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_case_study_tags"
  ON consulting_case_study_tags FOR SELECT TO anon USING (true);

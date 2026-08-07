-- =============================================================
-- schema_v2.sql  —  Complete Supabase schema (all sites + config)
-- Run AFTER schema.sql (which covers experience/projects/education/etc.)
-- =============================================================

-- =====================================================================
-- 1. CV — STATIC CONFIG (meta, about, techStack, consulting static data)
-- =====================================================================

-- cv_meta — single-row
CREATE TABLE IF NOT EXISTS cv_meta (
  id               INT  PRIMARY KEY DEFAULT 1,
  name             TEXT NOT NULL,
  title_es         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  location         TEXT,
  linkedin         TEXT,
  github           TEXT,
  twitter          TEXT,
  calendly         TEXT,
  ga4_id           TEXT
);
ALTER TABLE cv_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_meta" ON cv_meta FOR SELECT TO anon USING (true);

-- cv_about — single-row
CREATE TABLE IF NOT EXISTS cv_about (
  id               INT  PRIMARY KEY DEFAULT 1,
  title_es         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  text_es          TEXT NOT NULL,
  text_en          TEXT NOT NULL
);
ALTER TABLE cv_about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_about" ON cv_about FOR SELECT TO anon USING (true);

-- cv_tech_stack_categories
CREATE TABLE IF NOT EXISTS cv_tech_stack_categories (
  id               SERIAL PRIMARY KEY,
  name             TEXT   NOT NULL UNIQUE,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE cv_tech_stack_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_tech_stack_categories" ON cv_tech_stack_categories FOR SELECT TO anon USING (true);

-- cv_tech_stack_items
CREATE TABLE IF NOT EXISTS cv_tech_stack_items (
  id               SERIAL PRIMARY KEY,
  category_id      INT    NOT NULL,
  item             TEXT   NOT NULL,
  sort_order       INT    NOT NULL DEFAULT 0,
  CONSTRAINT fk_ts_cat FOREIGN KEY (category_id)
    REFERENCES cv_tech_stack_categories (id) ON DELETE CASCADE
);
ALTER TABLE cv_tech_stack_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_tech_stack_items" ON cv_tech_stack_items FOR SELECT TO anon USING (true);

-- cv_consulting_meta — single-row
CREATE TABLE IF NOT EXISTS cv_consulting_meta (
  id               INT  PRIMARY KEY DEFAULT 1,
  headline_es      TEXT NOT NULL,
  headline_en      TEXT NOT NULL,
  subheadline_es   TEXT NOT NULL,
  subheadline_en   TEXT NOT NULL,
  calendly_url     TEXT NOT NULL
);
ALTER TABLE cv_consulting_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_consulting_meta" ON cv_consulting_meta FOR SELECT TO anon USING (true);

-- cv_consulting_stats
CREATE TABLE IF NOT EXISTS cv_consulting_stats (
  id               SERIAL PRIMARY KEY,
  value            TEXT NOT NULL,
  label_es         TEXT NOT NULL,
  label_en         TEXT NOT NULL,
  sort_order       INT  NOT NULL DEFAULT 0
);
ALTER TABLE cv_consulting_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_consulting_stats" ON cv_consulting_stats FOR SELECT TO anon USING (true);

-- cv_consulting_process_steps
CREATE TABLE IF NOT EXISTS cv_consulting_process_steps (
  id               SERIAL PRIMARY KEY,
  number           TEXT NOT NULL,
  title_es         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_es   TEXT NOT NULL,
  description_en   TEXT NOT NULL,
  sort_order       INT  NOT NULL DEFAULT 0
);
ALTER TABLE cv_consulting_process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_cv_consulting_process_steps" ON cv_consulting_process_steps FOR SELECT TO anon USING (true);

-- =====================================================================
-- 2. BLOG POSTS INDEX
-- =====================================================================

-- blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id               SERIAL PRIMARY KEY,
  slug             TEXT   UNIQUE NOT NULL,
  file             TEXT,
  title_es         TEXT   NOT NULL,
  title_en         TEXT   NOT NULL,
  excerpt_es       TEXT,
  excerpt_en       TEXT,
  date             DATE   NOT NULL,
  category         TEXT,
  featured         BOOL   NOT NULL DEFAULT FALSE,
  read_time        TEXT,
  author           TEXT,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_blog_posts" ON blog_posts FOR SELECT TO anon USING (true);

-- blog_post_tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
  id               SERIAL PRIMARY KEY,
  post_id          INT    NOT NULL,
  tag              TEXT   NOT NULL,
  CONSTRAINT fk_bp_post FOREIGN KEY (post_id)
    REFERENCES blog_posts (id) ON DELETE CASCADE
);
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_blog_post_tags" ON blog_post_tags FOR SELECT TO anon USING (true);

-- blog_categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id               SERIAL PRIMARY KEY,
  name             TEXT   NOT NULL UNIQUE,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_blog_categories" ON blog_categories FOR SELECT TO anon USING (true);

-- =====================================================================
-- 3. VIDEOS
-- =====================================================================

-- videos
CREATE TABLE IF NOT EXISTS videos (
  id               TEXT   PRIMARY KEY,
  youtube_id       TEXT   NOT NULL,
  title_es         TEXT   NOT NULL,
  title_en         TEXT   NOT NULL,
  description_es   TEXT,
  description_en   TEXT,
  category         TEXT,
  duration         TEXT,
  date             DATE,
  channel          TEXT,
  featured         BOOL   NOT NULL DEFAULT FALSE,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_videos" ON videos FOR SELECT TO anon USING (true);

-- video_tags
CREATE TABLE IF NOT EXISTS video_tags (
  id               SERIAL PRIMARY KEY,
  video_id         TEXT   NOT NULL,
  tag              TEXT   NOT NULL,
  CONSTRAINT fk_vt_video FOREIGN KEY (video_id)
    REFERENCES videos (id) ON DELETE CASCADE
);
ALTER TABLE video_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_video_tags" ON video_tags FOR SELECT TO anon USING (true);

-- video_playlists
CREATE TABLE IF NOT EXISTS video_playlists (
  id               TEXT   PRIMARY KEY,
  name             TEXT   NOT NULL,
  description      TEXT,
  thumbnail        TEXT,
  video_count      INT    NOT NULL DEFAULT 0
);
ALTER TABLE video_playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_video_playlists" ON video_playlists FOR SELECT TO anon USING (true);

-- =====================================================================
-- 4. TAX CALCULATOR (AFIP params, scale, scenarios)
-- =====================================================================

-- tax_calculator_params — single-row, update each period
CREATE TABLE IF NOT EXISTS tax_calculator_params (
  id                    INT     PRIMARY KEY DEFAULT 1,
  period                TEXT    NOT NULL,            -- 'Ene-Jun 2026'
  gni                   NUMERIC NOT NULL,
  deduccion_especial    NUMERIC NOT NULL,
  conyuge               NUMERIC NOT NULL,
  hijo                  NUMERIC NOT NULL,
  hijo_incapacitado     NUMERIC NOT NULL,
  aportes_pct           NUMERIC NOT NULL,
  aportes_base_min      NUMERIC NOT NULL,
  aportes_base_max      NUMERIC NOT NULL,
  alquiler_pct          NUMERIC NOT NULL,
  alquiler_tope         NUMERIC NOT NULL,
  hipotecario_tope      NUMERIC NOT NULL,
  medicos_pct           NUMERIC NOT NULL,
  gn_tope_pct           NUMERIC NOT NULL,
  educacion_tope        NUMERIC NOT NULL,
  seguro_vida_tope      NUMERIC NOT NULL,
  sepelio_tope          NUMERIC NOT NULL,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tax_calculator_params ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_tax_calculator_params" ON tax_calculator_params FOR SELECT TO anon USING (true);

-- tax_scale_brackets — Art. 94 LIG brackets
CREATE TABLE IF NOT EXISTS tax_scale_brackets (
  id               SERIAL  PRIMARY KEY,
  params_id        INT     NOT NULL DEFAULT 1,
  bracket_order    INT     NOT NULL,
  limit_amount     NUMERIC NOT NULL,
  fixed_amount     NUMERIC NOT NULL,
  pct              NUMERIC NOT NULL,
  CONSTRAINT fk_tsb_params FOREIGN KEY (params_id)
    REFERENCES tax_calculator_params (id) ON DELETE CASCADE
);
ALTER TABLE tax_scale_brackets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_tax_scale_brackets" ON tax_scale_brackets FOR SELECT TO anon USING (true);

-- tax_scenarios
CREATE TABLE IF NOT EXISTS tax_scenarios (
  id                 SERIAL  PRIMARY KEY,
  label_es           TEXT    NOT NULL,
  label_en           TEXT    NOT NULL,
  salary_label_es    TEXT,
  salary_label_en    TEXT,
  gross_salary       NUMERIC NOT NULL,
  conyuge            BOOL    NOT NULL DEFAULT FALSE,
  hijos              INT     NOT NULL DEFAULT 0,
  hijos_incap        INT     NOT NULL DEFAULT 0,
  alquiler           NUMERIC NOT NULL DEFAULT 0,
  alquiler_anual     BOOL    NOT NULL DEFAULT TRUE,
  extra_income       NUMERIC NOT NULL DEFAULT 0,
  include_sac        BOOL    NOT NULL DEFAULT TRUE,
  color_class        TEXT,
  sort_order         INT     NOT NULL DEFAULT 0
);
ALTER TABLE tax_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_tax_scenarios" ON tax_scenarios FOR SELECT TO anon USING (true);

-- tax_tabs
CREATE TABLE IF NOT EXISTS tax_tabs (
  id               SERIAL  PRIMARY KEY,
  tab_id           TEXT    NOT NULL UNIQUE,
  label_es         TEXT    NOT NULL,
  label_en         TEXT    NOT NULL,
  title_es         TEXT    NOT NULL,
  title_en         TEXT    NOT NULL,
  content_es       TEXT    NOT NULL,
  content_en       TEXT    NOT NULL,
  formula_es       TEXT,
  formula_en       TEXT,
  sort_order       INT     NOT NULL DEFAULT 0
);
ALTER TABLE tax_tabs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_tax_tabs" ON tax_tabs FOR SELECT TO anon USING (true);

-- plazo_fijo_rates — historical plazo fijo rates %
CREATE TABLE IF NOT EXISTS plazo_fijo_rates (
  id               SERIAL  PRIMARY KEY,
  period           TEXT    NOT NULL UNIQUE,  -- '2024-01'
  monthly_rate     NUMERIC NOT NULL
);
ALTER TABLE plazo_fijo_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_plazo_fijo_rates" ON plazo_fijo_rates FOR SELECT TO anon USING (true);

-- =====================================================================
-- 5. AI MODELS PRICING (Token Calculator)
-- =====================================================================

-- ai_models
CREATE TABLE IF NOT EXISTS ai_models (
  id               SERIAL  PRIMARY KEY,
  name             TEXT    NOT NULL,
  provider         TEXT    NOT NULL,
  input_per_1m     NUMERIC NOT NULL,  -- USD per 1M tokens
  output_per_1m    NUMERIC NOT NULL,
  color_class      TEXT,
  sort_order       INT     NOT NULL DEFAULT 0
);
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_ai_models" ON ai_models FOR SELECT TO anon USING (true);

-- =====================================================================
-- 6. NEIL SITE
-- =====================================================================

-- neil_config — JSONB blobs for complex/rarely-queried sections
CREATE TABLE IF NOT EXISTS neil_config (
  id               INT  PRIMARY KEY DEFAULT 1,
  meta             JSONB NOT NULL DEFAULT '{}',
  brand            JSONB NOT NULL DEFAULT '{}',
  hero             JSONB NOT NULL DEFAULT '{}',
  flags            JSONB NOT NULL DEFAULT '{}',
  pre_cooling      JSONB NOT NULL DEFAULT '{}',
  europe           JSONB NOT NULL DEFAULT '{}',
  contact          JSONB NOT NULL DEFAULT '{}',
  footer           JSONB NOT NULL DEFAULT '{}',
  automations      JSONB NOT NULL DEFAULT '{}',
  sales_proposal   JSONB NOT NULL DEFAULT '{}'
);
ALTER TABLE neil_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_neil_config" ON neil_config FOR SELECT TO anon USING (true);

-- neil_product_categories
CREATE TABLE IF NOT EXISTS neil_product_categories (
  id               TEXT   PRIMARY KEY,   -- 'climatizadores', 'calderas', ...
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE neil_product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_neil_product_categories" ON neil_product_categories FOR SELECT TO anon USING (true);

-- neil_product_models
CREATE TABLE IF NOT EXISTS neil_product_models (
  id               SERIAL PRIMARY KEY,
  category_id      TEXT   NOT NULL,
  name             TEXT   NOT NULL,
  description      TEXT,
  image            TEXT,
  features         JSONB  NOT NULL DEFAULT '[]',
  sort_order       INT    NOT NULL DEFAULT 0,
  CONSTRAINT fk_npm_cat FOREIGN KEY (category_id)
    REFERENCES neil_product_categories (id) ON DELETE CASCADE
);
ALTER TABLE neil_product_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_neil_product_models" ON neil_product_models FOR SELECT TO anon USING (true);

-- neil_translations — full i18n — 6 langs × 114 keys = 684 rows
CREATE TABLE IF NOT EXISTS neil_translations (
  id               SERIAL PRIMARY KEY,
  lang             TEXT   NOT NULL,   -- 'es','en','pt','de','fr','it'
  key              TEXT   NOT NULL,   -- 'nav.home', 'hero.title', ...
  value            TEXT   NOT NULL,
  UNIQUE (lang, key)
);
ALTER TABLE neil_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_neil_translations" ON neil_translations FOR SELECT TO anon USING (true);

-- =====================================================================
-- 7. EL PORTUGUÉS SITE
-- =====================================================================

-- ep_config — JSONB blobs
CREATE TABLE IF NOT EXISTS ep_config (
  id               INT  PRIMARY KEY DEFAULT 1,
  meta             JSONB NOT NULL DEFAULT '{}',
  brand            JSONB NOT NULL DEFAULT '{}',
  hero             JSONB NOT NULL DEFAULT '{}',
  about            JSONB NOT NULL DEFAULT '{}',
  services         JSONB NOT NULL DEFAULT '{}',
  quality          JSONB NOT NULL DEFAULT '{}',
  values_section   JSONB NOT NULL DEFAULT '{}',
  contact          JSONB NOT NULL DEFAULT '{}',
  footer           JSONB NOT NULL DEFAULT '{}',
  automations      JSONB NOT NULL DEFAULT '{}',
  sales_proposal   JSONB NOT NULL DEFAULT '{}'
);
ALTER TABLE ep_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_ep_config" ON ep_config FOR SELECT TO anon USING (true);

-- ep_history_timeline
CREATE TABLE IF NOT EXISTS ep_history_timeline (
  id               SERIAL PRIMARY KEY,
  year             TEXT   NOT NULL,
  event_es         TEXT,
  event_en         TEXT,
  title_es         TEXT,
  title_en         TEXT,
  description_es   TEXT,
  description_en   TEXT,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE ep_history_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_ep_history_timeline" ON ep_history_timeline FOR SELECT TO anon USING (true);

-- ep_history_gallery
CREATE TABLE IF NOT EXISTS ep_history_gallery (
  id               SERIAL PRIMARY KEY,
  image_url        TEXT   NOT NULL,
  sort_order       INT    NOT NULL DEFAULT 0
);
ALTER TABLE ep_history_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_ep_history_gallery" ON ep_history_gallery FOR SELECT TO anon USING (true);

-- =====================================================================
-- INDEXES
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_cv_ts_items_cat   ON cv_tech_stack_items (category_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON blog_post_tags (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date     ON blog_posts (date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_cat      ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_video_tags_vid      ON video_tags (video_id);
CREATE INDEX IF NOT EXISTS idx_tax_brackets_param  ON tax_scale_brackets (params_id);
CREATE INDEX IF NOT EXISTS idx_neil_translations   ON neil_translations (lang, key);
CREATE INDEX IF NOT EXISTS idx_neil_prod_models    ON neil_product_models (category_id);
CREATE INDEX IF NOT EXISTS idx_ep_timeline_order   ON ep_history_timeline (sort_order);

-- Done — schema_v2.sql creates 24 additional tables
-- =============================================================
-- migrate_ai_models_feb2026.sql
-- Updates ai_models table with Feb 2026 current USD pricing.
--
-- Changes:
--   GPT-4o:        $5.00/$15.00  →  $2.50/$10.00  (Nov 2024 price cut)
--   o1-mini:       $3.00/$12.00  →  REMOVED (deprecated)
--   o3-mini:       NEW           →  $1.10/$4.40   (released Jan 2025)
--   Claude 3 Haiku: $0.25/$1.25  →  REMOVED (replaced by 3.5 Haiku)
--   Claude 3.5 Haiku: NEW        →  $0.80/$4.00   (released Nov 2024)
--   Gemini 1.5 Pro: $1.25/$5.00  →  REMOVED (replaced by 2.0 Flash)
--   Gemini 1.5 Flash: $0.075/$0.30 → REMOVED
--   Gemini 2.0 Flash: NEW        →  $0.10/$0.40   (released Feb 2025)
--   Gemini 2.0 Flash-Lite: NEW   →  $0.075/$0.30  (released Feb 2025)
--   Grok-2:        $2.00/$10.00  →  unchanged
-- =============================================================

-- 1. Clear existing rows
DELETE FROM ai_models;

-- 2. Reset sequence
ALTER SEQUENCE IF EXISTS ai_models_id_seq RESTART WITH 1;

-- 3. Insert updated models (USD per 1M tokens)
INSERT INTO ai_models (name, provider, input_per_1m, output_per_1m, color_class, sort_order) VALUES
  ('GPT-4o',              'OpenAI',    2.50,  10.00, 'text-green-400',  0),
  ('GPT-4o mini',         'OpenAI',    0.15,   0.60, 'text-green-300',  1),
  ('o3-mini',             'OpenAI',    1.10,   4.40, 'text-green-500',  2),
  ('Claude 3.5 Sonnet',   'Anthropic', 3.00,  15.00, 'text-orange-400', 3),
  ('Claude 3.5 Haiku',    'Anthropic', 0.80,   4.00, 'text-orange-300', 4),
  ('Gemini 2.0 Flash',    'Google',    0.10,   0.40, 'text-blue-400',   5),
  ('Gemini 2.0 Flash-Lite','Google',   0.075,  0.30, 'text-blue-300',   6),
  ('Grok-2',              'xAI',       2.00,  10.00, 'text-purple-400', 7);

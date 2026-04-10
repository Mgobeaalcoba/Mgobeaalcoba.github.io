-- =============================================================
-- migrate_ai_models_apr2026.sql
-- Full refresh: only 2025-2026 models from all 4 providers.
--
-- OpenAI  (source: platform.openai.com/docs/pricing — Apr 2026)
--   GPT-5.4           $2.50/$15.00  (released Mar 2026)
--   GPT-5.4 mini      $0.75/$4.50   (released Mar 2026)
--   GPT-4.1           $2.00/$8.00   (released Apr 2025)
--   o4-mini           $1.10/$4.40   (released Apr 2025)
--
-- Anthropic (source: docs.anthropic.com/en/about-claude/pricing — Apr 2026)
--   Claude Opus 4.6   $5.00/$25.00  (released 2026)
--   Claude Sonnet 4.6 $3.00/$15.00  (released Mar 2026)
--   Claude Haiku 4.5  $1.00/$5.00   (released Oct 2025)
--
-- Google (source: ai.google.dev/gemini-api/docs/pricing — Apr 2026)
--   Gemini 2.5 Pro    $1.25/$10.00  (stable, 2025)
--   Gemini 3 Flash    $0.50/$3.00   (2025-2026)
--   Gemini 2.5 Flash  $0.30/$2.50   (stable, 2025)
--
-- xAI (source: docs.x.ai/docs/models — Apr 2026)
--   Grok 4            $2.00/$6.00   (grok-4.20, 2026)
--   Grok 4.1 Fast     $0.20/$0.50   (grok-4-1-fast, 2026)
-- =============================================================

-- 1. Clear existing rows
DELETE FROM ai_models;

-- 2. Reset sequence
ALTER SEQUENCE IF EXISTS ai_models_id_seq RESTART WITH 1;

-- 3. Insert updated models (USD per 1M tokens)
INSERT INTO ai_models (name, provider, input_per_1m, output_per_1m, color_class, sort_order) VALUES
  -- OpenAI
  ('GPT-5.4',             'OpenAI',    2.50, 15.00, 'text-green-500',   0),
  ('GPT-5.4 mini',        'OpenAI',    0.75,  4.50, 'text-green-300',   1),
  ('GPT-4.1',             'OpenAI',    2.00,  8.00, 'text-green-400',   2),
  ('o4-mini',             'OpenAI',    1.10,  4.40, 'text-emerald-400', 3),
  -- Anthropic
  ('Claude Opus 4.6',     'Anthropic', 5.00, 25.00, 'text-orange-500',  4),
  ('Claude Sonnet 4.6',   'Anthropic', 3.00, 15.00, 'text-orange-400',  5),
  ('Claude Haiku 4.5',    'Anthropic', 1.00,  5.00, 'text-orange-300',  6),
  -- Google
  ('Gemini 2.5 Pro',      'Google',    1.25, 10.00, 'text-blue-400',    7),
  ('Gemini 3 Flash',      'Google',    0.50,  3.00, 'text-cyan-400',    8),
  ('Gemini 2.5 Flash',    'Google',    0.30,  2.50, 'text-blue-300',    9),
  -- xAI
  ('Grok 4',              'xAI',       2.00,  6.00, 'text-purple-400', 10),
  ('Grok 4.1 Fast',       'xAI',       0.20,  0.50, 'text-purple-300', 11);

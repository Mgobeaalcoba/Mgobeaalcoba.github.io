-- =============================================================
-- update_frontier_ai_models_aug2026.sql
-- Full refresh: current generally available frontier model families.
-- Standard text API pricing in USD per 1M tokens, verified 2026-08-07.
-- Excludes cached input, Batch/Flex/Priority, volume discounts, regional
-- processing and long-context surcharges.
--
-- OpenAI (developers.openai.com/api/docs/models)
--   GPT-5.6 Sol       $5.00/$30.00
--   GPT-5.6 Terra     $2.50/$15.00
--   GPT-5.6 Luna      $1.00/$6.00
--
-- Anthropic (platform.claude.com/docs/en/about-claude/pricing)
--   Claude Fable 5   $10.00/$50.00
--   Claude Opus 5     $5.00/$25.00
--   Claude Sonnet 5   $2.00/$10.00 introductory pricing through 2026-08-31
--
-- Google (ai.google.dev/gemini-api/docs/pricing)
--   Gemini 3.1 Pro Preview $2.00/$12.00 for prompts <= 200k tokens
--
-- xAI (docs.x.ai/developers/pricing)
--   Grok 4.5           $2.00/$6.00 for prompts < 200k tokens
-- =============================================================

BEGIN;

ALTER TABLE ai_models
  ADD COLUMN IF NOT EXISTS is_frontier BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pricing_verified_at DATE;

DELETE FROM ai_models;

ALTER SEQUENCE IF EXISTS ai_models_id_seq RESTART WITH 1;

INSERT INTO ai_models (
  name,
  provider,
  input_per_1m,
  output_per_1m,
  color_class,
  sort_order,
  is_frontier,
  pricing_verified_at
) VALUES
  ('GPT-5.6 Sol',            'OpenAI',             5.00, 30.00, 'text-green-500',   0, TRUE, '2026-08-07'),
  ('GPT-5.6 Terra',          'OpenAI',             2.50, 15.00, 'text-green-400',   1, TRUE, '2026-08-07'),
  ('GPT-5.6 Luna',           'OpenAI',             1.00,  6.00, 'text-green-300',   2, TRUE, '2026-08-07'),
  ('Claude Fable 5',         'Anthropic',         10.00, 50.00, 'text-orange-500',  3, TRUE, '2026-08-07'),
  ('Claude Opus 5',          'Anthropic',          5.00, 25.00, 'text-orange-400',  4, TRUE, '2026-08-07'),
  ('Claude Sonnet 5',        'Anthropic',          2.00, 10.00, 'text-orange-300',  5, TRUE, '2026-08-07'),
  ('Gemini 3.1 Pro Preview', 'Google · Alphabet',  2.00, 12.00, 'text-blue-400',    6, TRUE, '2026-08-07'),
  ('Grok 4.5',               'xAI',                2.00,  6.00, 'text-purple-400',  7, TRUE, '2026-08-07');

COMMIT;

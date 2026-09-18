-- =============================================================
-- 018_document_manually_loaded_videos_7_to_10.sql
-- Documents videos that were loaded by hand into production and never
-- versioned: video-7 .. video-10 (001/002 only seed video-1 .. video-6).
-- The rows below are a verbatim copy of what production held on 2026-09-18
-- (including copy/paste artifacts, see notes), so a fresh environment
-- built from 001..018 matches production.
--
-- Run in Supabase SQL editor AFTER 017_credit_mariano_on_henry_ai_automation_masterclass.sql
-- On production this is a no-op: every statement is idempotent and the rows
-- already exist.
--
-- Notes (left as-is on purpose; fix them in a separate migration):
--   * video-8 title_es ends with a newline, and its description_es contains
--     three zero-width spaces (U+200B) copied from YouTube.
--   * video-10 description_es ends with a URL truncated by YouTube
--     ("carrera-ai-a..."), and description_en says "the race" for "la carrera".
--   * video-10 description_es has a trailing space after "negocio." (before the
--     blank line); do not let an editor strip it if you want the copy verbatim.
--   * Only video-9 has tags; video-7, video-8 and video-10 have none.
--   * video_tags.id is SERIAL, so tags are inserted without an explicit id.
-- =============================================================

-- 1. Videos ----------------------------------------------------
INSERT INTO videos (
  id, youtube_id,
  title_es, title_en,
  description_es, description_en,
  category, duration, date, channel, featured, sort_order
) VALUES
  ('video-7', '49K4tdry2gw',
  '¿Cómo usar N8N? Guía completa para principiantes (Triggers, Interfaz y Flujos)', 'How to use N8N? Complete beginners guide (Triggers, Interface and Flows)',
  'Masterclass en vivo con Mariano Gobea, Tech Lead en Mercado Libre. Aprende n8n desde cero: interfaz, nodos, triggers y cómo conectar aplicaciones para crear tu primer flujo automatizado con lógica real.', 'Live masterclass with Mariano Gobea, Tech Lead at Mercado Libre. Learn n8n from scratch: interface, nodes, triggers, and how to connect applications to create your first automated workflow with real logic.',
  'automation', '1:08:35', '2026-03-10', 'Henry', TRUE, 7),

  ('video-8', '24xGV4vqSZk',
  '¿Qué es un Agente de IA y cómo crearlo desde cero con n8n? (Guía 2026)
', 'What is an AI Agent and how to create one from scratch with n8n? (2026 Guide)',
  '​¿Sabés qué es un agente de IA y por qué todos están hablando de esto?

​En esta masterclass gratuita con Mariano Gobea, Tech Lead de Mercado Libre, vas a aprender:
👉 Qué es un agente de inteligencia artificial
👉 Cómo funciona en la vida real
👉 Cómo crear el tuyo con n8n (paso a paso)

​La IA ya está cambiando el mercado.
La pregunta es: ¿vas a usarla o quedarte atrás?', 'Do you know what an AI agent is and why everyone''s talking about it?

In this free masterclass with Mariano Gobea, Tech Lead at Mercado Libre, you''ll learn:
👉 What an artificial intelligence agent is
👉 How it works in real-world scenarios
👉 How to create your own with n8n (step by step)

AI is already changing the market.

The question is: are you going to use it or get left behind?',
  'automation', '52:37', '2026-03-30', 'Henry', TRUE, 0),

  ('video-9', 'BDqt3pqFfjg',
  'Layoffs, Hiring & GenAI: El Gran Reajuste Laboral', 'Layoffs, Hiring & GenAI: The Great Labor Readjustment',
  'Mariano Gobea lleva 7+ años liderando equipos de datos e IA en Mercado Libre y, simultáneamente enseña Data Science y automatización con IA. Esa doble perspectiva (dentro de la Big Tech latinoamericana y en el aula) le da un punto de ventaja único para investigar qué está pasando realmente.

En esta conversación cruzamos sus hallazgos con los datos más rigurosos disponibles:

• La magnitud real: Layoffs en tech 2020-2026: ¿Cuántos son a causa de la IA vs corrección post-COVID?
• Perspectiva Latam: ¿Cómo se ve desde el mundo tech? ¿Qué sectores siguen contratando vs congelando?
• El dato que nadie dice: ¿Por qué 1 de cada 4 trabajadores white collar desplazados en 2024 venía de servicios profesionales?
• Lo que viene: ¿IA destruye o crea empleos?', 'Mariano Gobea has been leading data and AI teams at Mercado Libre for 7+ years while simultaneously teaching Data Science and AI automation. That dual perspective (inside Latin American Big Tech and in the classroom) gives him a unique vantage point to investigate what is really happening.

In this conversation we cross his findings with the most rigorous data available:

• The real magnitude: Tech layoffs 2020-2026 — How many are caused by AI vs a post-COVID correction?
• Latam perspective: How does it look from the tech world? Which sectors keep hiring vs freezing?
• The data nobody mentions: Why did 1 in 4 displaced white-collar workers in 2024 come from professional services?
• What is next: Does AI destroy or create jobs?',
  'genai', '1:01:41', '2026-04-16', 'AI The New Sexy', TRUE, 8),

  ('video-10', 'HCJgMgfyGAA',
  'Armé un Prode del Mundial con IA y n8n (y funciona de verdad) | Masterclass gratis', 'I built a World Cup Prode with AI and n8n (and it really works) | Free Masterclass',
  '¿Nunca usaste n8n ni automatizaste nada en tu vida? Perfecto. Esta masterclass es para ti.

En este live, Mariano Gobea (Tech Lead de Mercado Libre) construye desde cero un Prode del Mundial completamente automatizado con n8n, Airtable, API-Football y GPT-4o — en tiempo real.

Lo que vas a ver:
→ Cómo recibir datos de un formulario y guardarlos automáticamente
→ Cómo conectar una API real para traer resultados de partidos en vivo
→ Cómo usar IA para calcular puntos y mandar mensajes personalizados por país

Todo esto es exactamente lo que aprendés en la Carrera AI Automation de Henry: automatizaciones reales, con herramientas reales, aplicadas a problemas reales de negocio. 

En 10 semanas, part-time, sin necesitar experiencia técnica previa.

🎁 Blueprint gratuito: el archivo JSON del workflow completo, listo para importar con un click — solo para los que se registraron.

🚀 ¿Querés aprender AI Automation en serio?
Conocé la carrera → https://www.soyhenry.com/carrera-ai-a...', 'Have you never used n8n or automated anything in your life? Perfect. This masterclass is for you.

In this live, Mariano Gobea (Mercado Libre''s Tech Lead) builds a fully automated World Cup Prode from scratch with n8n, Airtable, API-Football and GPT-4o — in real time.

What you will see:
→ How to receive data from a form and save it automatically
→ How to connect a real API to bring live match results
→ How to use AI to calculate points and send personalized messages by country

All of this is exactly what you learn in Henry''s AI Automation Career: real automations, with real tools, applied to real business problems.

In 10 weeks, part-time, without requiring prior technical experience.

🎁 Free Blueprint: the JSON file of the complete workflow, ready to import with one click — only for those who registered.

🚀 Do you want to learn AI Automation seriously?
Get to know the race → https://www.soyhenry.com/carrera-ai-a...',
  'automation', '1:05:39', '2026-07-02', 'Henry', TRUE, 9)
ON CONFLICT (id) DO NOTHING;

-- 2. Tags (only video-9 has any in production) -------------------
INSERT INTO video_tags (video_id, tag)
SELECT 'video-9', t.tag
FROM unnest(ARRAY['genai', 'ai', 'mercadolibre', 'layoffs', 'hiring', 'career', 'latam', 'labor-market']) AS t(tag)
WHERE EXISTS (SELECT 1 FROM videos WHERE id = 'video-9')
  AND NOT EXISTS (
    SELECT 1 FROM video_tags vt WHERE vt.video_id = 'video-9' AND vt.tag = t.tag
  );

-- 3. Display order --------------------------------------------
-- Production's sort_order for video-1 .. video-6 no longer matches
-- 002_seed_initial_data.sql (video-8 was placed first, the rest shifted one
-- position, and video-5/video-6 share sort_order 5). Reconcile it so a fresh
-- environment orders the video library like production. No-op on production.
UPDATE videos AS v
SET sort_order = m.sort_order
FROM (VALUES
  ('video-1', 1),
  ('video-2', 2),
  ('video-3', 3),
  ('video-4', 4),
  ('video-5', 5),
  ('video-6', 5)
) AS m(id, sort_order)
WHERE v.id = m.id
  AND v.sort_order IS DISTINCT FROM m.sort_order;

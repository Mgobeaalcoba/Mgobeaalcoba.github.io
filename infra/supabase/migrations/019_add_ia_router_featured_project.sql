-- =============================================================
-- 019_add_ia_router_featured_project.sql
-- Adds ia-router as the first featured project of "03 / Trabajo" in /portfolio
-- (the card renders as "01 / Destacado"; the n8n-AI Automation card becomes the second one).
-- Source: https://github.com/Mgobeaalcoba/ia-suscription-router (PyPI: ia-router, Homebrew tap Mgobeaalcoba/tap)
-- Run in Supabase SQL editor AFTER 018_document_manually_loaded_videos_7_to_10.sql
--
-- Notes:
--   * `projects.id` has no default, so the new id is MAX(id) + 1. `project_tags.id` is SERIAL.
--   * sort_order 0 is the first card, so every existing project moves down by one.
--   * Idempotent: it does nothing if a project with that link already exists, so re-running it
--     does not shift the order again or duplicate the card.
--   * Titles stay under ~58 characters: the card clamps the title to three lines.
--   * Rollback: DELETE FROM project_tags WHERE project_id = (SELECT id FROM projects WHERE link = '<link>');
--               DELETE FROM projects WHERE link = '<link>'; UPDATE projects SET sort_order = sort_order - 1;
-- =============================================================

DO $$
DECLARE
  repo_link CONSTANT text := 'https://github.com/Mgobeaalcoba/ia-suscription-router';
  new_id integer;
BEGIN
  IF EXISTS (SELECT 1 FROM projects WHERE link = repo_link) THEN
    RETURN;
  END IF;

  UPDATE projects SET sort_order = sort_order + 1;

  SELECT COALESCE(MAX(id), 0) + 1 INTO new_id FROM projects;

  INSERT INTO projects (id, title_es, title_en, description_es, description_en, link, sort_order)
  VALUES (
    new_id,
    '[Python-AI Router] ia-router: suscripciones de IA ruteadas',
    '[Python-AI Router] ia-router: AI subscriptions, routed',
    'CLI y panel web open source (Apache-2.0) que reparte cada tarea entre Claude, Codex y Antigravity según métricas objetivas de Arena y Artificial Analysis. Incluye conectores MCP (Gmail, Calendar…), comparación de modelos, medidor de cuota y sesiones guardadas. Publicado en PyPI y Homebrew, sin dependencias.',
    'Open-source (Apache-2.0) CLI and web panel that splits each task across Claude, Codex and Antigravity using objective metrics from Arena and Artificial Analysis. Includes MCP connectors (Gmail, Calendar…), model comparison, a quota meter and saved sessions. Published on PyPI and Homebrew, with no dependencies.',
    repo_link,
    0
  );

  INSERT INTO project_tags (project_id, tag)
  SELECT new_id, t.tag
  FROM unnest(ARRAY['Python', 'AI', 'MCP', 'PyPI', 'Homebrew', 'Git']) AS t(tag);
END
$$;

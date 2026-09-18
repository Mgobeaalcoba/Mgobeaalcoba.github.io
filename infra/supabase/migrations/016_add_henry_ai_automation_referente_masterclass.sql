-- =============================================================
-- 016_add_henry_ai_automation_referente_masterclass.sql
-- Adds the Henry masterclass "Cómo convertirte en el referente de IA de tu
-- empresa | AI Automation en SoyHenry" to the video library (/blog/videos/
-- and the "Learn on video" section of /blog/).
-- Source: https://www.youtube.com/watch?v=VRezpIcvG4U
--   (canal Henry, publicado 2026-09-16, 41:42, presenta Milagros Savino,
--    Business Lead en Henry)
-- Run in Supabase SQL editor AFTER 015_reorder_educacionit_roles.sql
--
-- Notes:
--   * `videos.id` is a manual TEXT key. Production already holds video-1 ..
--     video-10 (video-7 .. video-10 were loaded by hand and are not in
--     001/002), so this uses video-11. sort_order 10 appends after video-10.
--   * `video_tags.id` is SERIAL, so tags are inserted without an explicit id.
--   * Idempotent: re-running it does not duplicate the video or its tags.
-- =============================================================

INSERT INTO videos (
  id, youtube_id,
  title_es, title_en,
  description_es, description_en,
  category, duration, date, channel, featured, sort_order
) VALUES (
  'video-11', 'VRezpIcvG4U',
  'Cómo convertirte en el referente de IA de tu empresa | AI Automation en SoyHenry',
  'How to become your company''s AI lead | AI Automation at SoyHenry',
  'Masterclass de Henry sobre el rol de AI Automation. Milagros Savino, Business Lead en Henry, recorre qué es ese perfil, qué hace en el día a día y cómo llegar a él desde donde ya estás: pasar de usar IA para tareas sueltas a automatizar con IA los procesos que hoy pasan por tus manos, uno por uno.',
  'Henry masterclass on the AI Automation role. Milagros Savino, Business Lead at Henry, walks through what that profile is, what it does day to day and how to get there from where you already are: moving from using AI for one-off tasks to automating with AI the processes that today go through your hands, one by one.',
  'automation', '41:42', '2026-09-16', 'Henry', TRUE, 10
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO video_tags (video_id, tag)
SELECT 'video-11', t.tag
FROM unnest(ARRAY['automation', 'ai', 'ai-automation', 'career', 'process-automation']) AS t(tag)
WHERE EXISTS (SELECT 1 FROM videos WHERE id = 'video-11')
  AND NOT EXISTS (
    SELECT 1 FROM video_tags vt WHERE vt.video_id = 'video-11' AND vt.tag = t.tag
  );

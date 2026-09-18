-- =============================================================
-- 017_credit_mariano_on_henry_ai_automation_masterclass.sql
-- Corrects the description of video-11 (added in 016): the masterclass was
-- co-hosted by Milagros Savino (Business Lead, Henry) and Mariano Gobea
-- (Tech Lead, Mercado Libre). 016 credited only Milagros.
-- Run in Supabase SQL editor AFTER 016_add_henry_ai_automation_referente_masterclass.sql
-- (016 is already applied, so it is not rewritten; this migration is idempotent).
-- =============================================================

UPDATE videos
SET
  description_es = 'Masterclass en vivo de Henry sobre el rol de AI Automation, conducida por Milagros Savino, Business Lead en Henry, y Mariano Gobea, Tech Lead en Mercado Libre. Recorren qué es ese perfil, qué hace en el día a día y cómo llegar a él desde donde ya estás: pasar de usar IA para tareas sueltas a automatizar con IA los procesos que hoy pasan por tus manos, uno por uno.',
  description_en = 'Live Henry masterclass on the AI Automation role, hosted by Milagros Savino, Business Lead at Henry, and Mariano Gobea, Tech Lead at Mercado Libre. They walk through what that profile is, what it does day to day and how to get there from where you already are: moving from using AI for one-off tasks to automating with AI the processes that today go through your hands, one by one.'
WHERE id = 'video-11';

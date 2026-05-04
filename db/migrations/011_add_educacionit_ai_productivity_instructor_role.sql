-- =============================================================
-- 011_add_educacionit_ai_productivity_instructor_role.sql
-- Adds the active EducacionIT AI/Productivity instructor role.
-- Run in Supabase SQL editor AFTER 010_remove_calendly_columns.sql
-- =============================================================

-- Shift existing roles once so EducacionIT appears below Mercado Libre
-- and above ISTEA in the portfolio experience section.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM experience WHERE id = 17) THEN
    UPDATE experience
    SET sort_order = sort_order + 1
    WHERE sort_order >= 6;
  END IF;
END $$;

INSERT INTO experience (
  id,
  date_es,
  date_en,
  title_es,
  title_en,
  company,
  company_logo,
  start_date,
  end_date,
  description_es,
  description_en,
  sort_order
) VALUES (
  17,
  'May 2026 - actualidad',
  'May 2026 - Present',
  'Instructor de Inteligencia Artificial y Productividad',
  'Artificial Intelligence and Productivity Instructor',
  'EducacionIT',
  '/logos/educacionit.svg',
  '2026-05-01',
  NULL,
  '<li>Liderazgo en formacion de IA Generativa: facilitacion de programas practicos orientados a la optimizacion de flujos de trabajo mediante el uso estrategico de modelos de lenguaje y herramientas de automatizacion.</li><li>Diseno de ecosistemas de productividad con IA: implementacion de metodologias para integrar agentes de IA, sistemas RAG y herramientas de automatizacion en entornos profesionales para potenciar la eficiencia operativa.</li><li>Desarrollo de laboratorios de automatizacion: creacion y despliegue de entornos de experimentacion donde los estudiantes aplican tecnicas de ingenieria de prompts y orquestacion de IA para resolver desafios de productividad del mundo real.</li><li>Mentoria en ingenieria de prompts y agentes: capacitacion en el diseno de prompts avanzados y la configuracion de asistentes inteligentes que aceleran la toma de decisiones y la ejecucion de tareas complejas.</li><li>Integracion de contenidos multidisciplinarios: estructuracion de materiales pedagogicos que vinculan la teoria de los grandes modelos de lenguaje con la practica profesional, asegurando una transicion directa a la implementacion laboral.</li><li>Innovacion en procesos de trabajo: promocion de una cultura de experimentacion constante con IA, fomentando el pensamiento critico sobre la automatizacion y la mejora continua de la productividad organizacional.</li>',
  '<li>Generative AI training leadership: facilitation of practical programs focused on workflow optimization through the strategic use of language models and automation tools.</li><li>AI productivity ecosystem design: implementation of methodologies to integrate AI agents, RAG systems, and automation tools into professional environments to increase operational efficiency.</li><li>Automation lab development: creation and deployment of experimentation environments where students apply prompt engineering and AI orchestration techniques to solve real-world productivity challenges.</li><li>Prompt and agent engineering mentorship: training in advanced prompt design and intelligent assistant configuration to accelerate decision-making and complex task execution.</li><li>Multidisciplinary content integration: structuring educational materials that connect large language model theory with professional practice, ensuring a direct transition to workplace implementation.</li><li>Work process innovation: promotion of a culture of constant experimentation with AI, fostering critical thinking about automation and continuous improvement in organizational productivity.</li>',
  6
)
ON CONFLICT (id) DO UPDATE SET
  date_es = EXCLUDED.date_es,
  date_en = EXCLUDED.date_en,
  title_es = EXCLUDED.title_es,
  title_en = EXCLUDED.title_en,
  company = EXCLUDED.company,
  company_logo = EXCLUDED.company_logo,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  description_es = EXCLUDED.description_es,
  description_en = EXCLUDED.description_en,
  sort_order = EXCLUDED.sort_order;

DELETE FROM experience_tags WHERE experience_id = 17;

INSERT INTO experience_tags (experience_id, tag) VALUES
  (17, 'Generative AI'),
  (17, 'AI Agents'),
  (17, 'RAG'),
  (17, 'Automation'),
  (17, 'Prompt Engineering'),
  (17, 'Productivity'),
  (17, 'LLM'),
  (17, 'Teaching'),
  (17, 'Mentoring');

-- =============================================================
-- 009_add_istea_programming_professor_role.sql
-- Adds a new active teaching role at ISTEA.
-- Run in Supabase SQL editor AFTER 008_add_machine_learning_post.sql
-- =============================================================

-- Shift existing sort order once to make room for the new role at sort_order=6
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM experience WHERE id = 16) THEN
    UPDATE experience
    SET sort_order = sort_order + 1
    WHERE sort_order >= 6;
  END IF;
END $$;

-- Upsert new experience row
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
  16,
  'Mar 2026 - actualidad',
  'Mar 2026 - Present',
  'Profesor de Programacion Orientada a la Mineria de Datos',
  'Data Mining-Oriented Programming Professor',
  'ISTEA',
  NULL,
  '2026-03-01',
  NULL,
  '<li>Liderazgo academico en Data Mining: facilitacion de clases teoricas y practicas centradas en el ciclo de vida de mineria de datos, desde ETL hasta el descubrimiento de patrones y modelos predictivos.</li><li>Diseno de ecosistemas de aprendizaje con IA: implementacion de herramientas como NotebookLM para curacion de contenidos y Gemini como asistente de tutoria.</li><li>Desarrollo de laboratorios practicos en Python: creacion de notebooks en Jupyter y Google Colab con ejercicios aplicados usando Pandas, NumPy y Scikit-learn.</li><li>Mentoria en ingenieria de prompts para desarrolladores: acompanamiento en uso etico y tecnico de asistentes de codigo e IA para optimizacion y depuracion.</li><li>Integracion de contenidos multidisciplinarios: estructuracion de materiales desde bases de datos hasta tecnicas avanzadas de modelado.</li><li>Innovacion en evaluacion y experimentacion: promocion del pensamiento critico sobre calidad de datos y sesgos en algoritmos de mineria.</li>',
  '<li>Academic leadership in Data Mining: facilitating theoretical and practical classes focused on the full data mining lifecycle, from ETL to pattern discovery and predictive models.</li><li>AI-powered learning ecosystem design: implementation of tools such as NotebookLM for content curation and Gemini as a tutoring assistant.</li><li>Hands-on Python lab development: creation of Jupyter and Google Colab notebooks with applied exercises using Pandas, NumPy, and Scikit-learn.</li><li>Prompt engineering mentorship for developers: guidance on ethical and technical use of coding assistants and AI for optimization and debugging.</li><li>Multidisciplinary content integration: structuring materials from database fundamentals to advanced modeling techniques.</li><li>Innovation in assessment and experimentation: fostering critical thinking about data quality and bias impact in mining algorithms.</li>',
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

-- Refresh tags for this role (safe re-run)
DELETE FROM experience_tags WHERE experience_id = 16;

INSERT INTO experience_tags (experience_id, tag) VALUES
  (16, 'Python'),
  (16, 'Data Mining'),
  (16, 'Machine Learning'),
  (16, 'Pandas'),
  (16, 'NumPy'),
  (16, 'Scikit-learn'),
  (16, 'Jupyter'),
  (16, 'Google Colab'),
  (16, 'NotebookLM'),
  (16, 'Gemini'),
  (16, 'Prompt Engineering'),
  (16, 'Teaching');

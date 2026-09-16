-- =============================================================
-- 014_add_educacionit_claude_code_instructor_role.sql
-- Adds the "Automatización con Claude y Claude Code" course taught at
-- EducacionIT since August 2026, as a second role under the same employer.
-- Course source: https://www.educacionit.com/curso-de-claude-ai-y-claude-code
--   (6 semanas / 18 h / 18 clases online en vivo / nivel intermedio)
-- Run in Supabase SQL editor AFTER 013_harden_assistant_data_access.sql
-- =============================================================

-- Shift existing roles once so the new course appears directly below the
-- existing EducacionIT role and above ISTEA in the portfolio experience section.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM experience WHERE id = 18) THEN
    UPDATE experience
    SET sort_order = sort_order + 1
    WHERE sort_order >= 7;
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
  18,
  'Ago 2026 - actualidad',
  'Aug 2026 - Present',
  'Instructor de Automatización con Claude y Claude Code',
  'Claude & Claude Code Automation Instructor',
  'EducacionIT',
  '/logos/educacionit.svg',
  '2026-08-01',
  NULL,
  '<li>Instructor del curso Automatización con Claude y Claude Code: dictado de un programa de 6 semanas y 18 horas online en vivo, orientado a construir agentes, automatizaciones avanzadas y sistemas de IA conectados con herramientas reales.</li><li>Formación en Claude Code: setup del entorno, agentic loop, Plan Mode y Thinking, gestión de contexto, comandos custom, skills avanzadas, subagentes especializados, hooks automáticos y flujos integrados con GitHub.</li><li>Diseño de laboratorios sobre Model Context Protocol: arquitectura MCP, servidor MCP en Python, tools y resources, JSON-RPC, debugging, deploy e integración de conectores en Claude Cowork y Claude Code.</li><li>Orquestación multi-agente: patrones de agentes, orquestación con CrewAI, AutoGen y LangGraph, y construcción de repositorios con agentes orquestadores.</li><li>Proyecto final aplicado: acompañamiento a los estudiantes en el desarrollo de una automatización profesional que resuelve un proceso real de trabajo combinando Claude, Claude Code, MCP y agentes especializados.</li><li>Mentoría en grupos reducidos: seguimiento personalizado del progreso, evaluación basada en desafíos y acompañamiento en decisiones de arquitectura de automatizaciones.</li>',
  '<li>Instructor of the Automatización con Claude y Claude Code course: delivery of a 6-week, 18-hour live online program focused on building agents, advanced automations and AI systems connected to real tools.</li><li>Claude Code training: environment setup, agentic loop, Plan Mode and Thinking, context management, custom commands, advanced skills, specialized subagents, automatic hooks and integrated GitHub flows.</li><li>Model Context Protocol lab design: MCP architecture, Python MCP server, tools and resources, JSON-RPC, debugging, deploy and connector integration across Claude Cowork and Claude Code.</li><li>Multi-agent orchestration: agent patterns, orchestration with CrewAI, AutoGen and LangGraph, and building repositories with orchestrator agents.</li><li>Applied capstone project: guiding students through a professional automation that solves a real work process by combining Claude, Claude Code, MCP and specialized agents.</li><li>Small-group mentoring: personalized progress follow-up, challenge-based assessment and guidance on automation architecture decisions.</li>',
  7
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

DELETE FROM experience_tags WHERE experience_id = 18;

INSERT INTO experience_tags (experience_id, tag) VALUES
  (18, 'Claude'),
  (18, 'Claude Code'),
  (18, 'MCP'),
  (18, 'AI Agents'),
  (18, 'Multi-Agent Orchestration'),
  (18, 'Prompt Engineering'),
  (18, 'Automation'),
  (18, 'Teaching');

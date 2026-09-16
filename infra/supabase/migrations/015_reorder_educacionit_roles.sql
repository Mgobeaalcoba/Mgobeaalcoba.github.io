-- =============================================================
-- 015_reorder_educacionit_roles.sql
-- 014 inserted the Claude & Claude Code course below the AI & Productivity
-- role, but the course is more recent (Aug 2026 vs May 2026). Every other
-- employer group lists the most recent role first (see Mercado Libre and
-- Henry), so both EducacionIT roles must be swapped to match.
-- Run in Supabase SQL editor AFTER 014_add_educacionit_claude_code_instructor_role.sql
-- =============================================================

UPDATE experience
SET sort_order = CASE WHEN id = 18 THEN 6 ELSE 7 END
WHERE id IN (17, 18);

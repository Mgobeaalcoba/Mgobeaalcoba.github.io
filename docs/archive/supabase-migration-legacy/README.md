# Supabase Migration Plan
## mgobeaalcoba.github.io — JSON → PostgreSQL

---

## Context & Constraints

The site is a **static Next.js export hosted on GitHub Pages**. There is no backend, no server-side API routes and no build-time secrets injection. All data reads must happen **client-side** using Supabase's browser SDK with the **anon key**.

Security model: the anon key is safe to commit/expose because every table has **Row Level Security (RLS) enabled** with policies that only allow `SELECT` for the `anon` role. No INSERT / UPDATE / DELETE is ever permitted from the frontend.

---

## Account Requirements

| Item | Requirement |
|---|---|
| Supabase tier | **Free** (no credit card required) |
| Storage | < 10 MB (well within 500 MB free limit) |
| Bandwidth | < 1 GB/month (well within 2 GB free limit) |
| Row count | ~500 rows total (well within 50k free limit) |
| API requests | Unlimited on free tier |
| Database | PostgreSQL 15 (included) |

**Create project at:** https://app.supabase.com → New project

---

## What Gets Migrated vs. What Stays

### Migrated to Supabase
| Entity | Reason |
|---|---|
| `experience` | Rich bilingual content, will grow over time |
| `projects` | Needs filtering by tag, benefits from DB queries |
| `education` | Structured records, good for relational queries |
| `certifications` | Tag-based filtering |
| `consulting_packs` | Content marketing, updated periodically |
| `consulting_pack_features` | Child of packs |
| `consulting_pack_automations` | Child of packs |
| `consulting_case_studies` | Portfolio items, tag-filtered |

### Stays Local / Static
| Entity | Reason |
|---|---|
| `meta` | Single config row, rarely changes, better as constants file |
| `about` | Single paragraph, no relational benefit |
| `techStack` | Flat string list, no relations needed |
| Blog post content | Markdown files are already optimal for static rendering |

---

## Table Schemas

### Core tables

```sql
-- Experience entries
CREATE TABLE experience (
  id          INT PRIMARY KEY,
  date_es     TEXT NOT NULL,
  date_en     TEXT NOT NULL,
  title_es    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  company     TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE experience_tags (
  id            SERIAL PRIMARY KEY,
  experience_id INT NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
  tag           TEXT NOT NULL
);

-- Projects
CREATE TABLE projects (
  id             INT PRIMARY KEY,
  title_es       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  link           TEXT NOT NULL,
  sort_order     INT NOT NULL DEFAULT 0
);

CREATE TABLE project_tags (
  id         SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL
);

-- Education
CREATE TABLE education (
  id          SERIAL PRIMARY KEY,
  title_es    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  school      TEXT NOT NULL,
  date        TEXT NOT NULL,
  subtitle_es TEXT,
  subtitle_en TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE education_tags (
  id           SERIAL PRIMARY KEY,
  education_id INT NOT NULL REFERENCES education(id) ON DELETE CASCADE,
  tag          TEXT NOT NULL
);

-- Certifications
CREATE TABLE certifications (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE certification_tags (
  id                 SERIAL PRIMARY KEY,
  certification_id   INT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  tag                TEXT NOT NULL
);

-- Consulting packs
CREATE TABLE consulting_packs (
  id             TEXT PRIMARY KEY,
  name_es        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  subtitle_es    TEXT NOT NULL,
  subtitle_en    TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price_es       TEXT NOT NULL,
  price_en       TEXT NOT NULL,
  highlighted    BOOLEAN NOT NULL DEFAULT FALSE,
  badge_es       TEXT,
  badge_en       TEXT,
  sort_order     INT NOT NULL DEFAULT 0
);

CREATE TABLE consulting_pack_features (
  id         SERIAL PRIMARY KEY,
  pack_id    TEXT NOT NULL REFERENCES consulting_packs(id) ON DELETE CASCADE,
  text_es    TEXT NOT NULL,
  text_en    TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE consulting_pack_automations (
  id         SERIAL PRIMARY KEY,
  pack_id    TEXT NOT NULL REFERENCES consulting_packs(id) ON DELETE CASCADE,
  text_es    TEXT NOT NULL,
  text_en    TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Consulting case studies
CREATE TABLE consulting_case_studies (
  id             TEXT PRIMARY KEY,
  title_es       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  result_es      TEXT NOT NULL,
  result_en      TEXT NOT NULL,
  image          TEXT NOT NULL,
  sort_order     INT NOT NULL DEFAULT 0
);

CREATE TABLE consulting_case_study_tags (
  id              SERIAL PRIMARY KEY,
  case_study_id   TEXT NOT NULL REFERENCES consulting_case_studies(id) ON DELETE CASCADE,
  tag             TEXT NOT NULL
);
```

### RLS Policies (run after CREATE TABLE)

```sql
-- Enable RLS on every table
ALTER TABLE experience               ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE education                ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_tags       ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_packs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_pack_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_pack_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_case_studies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_case_study_tags ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) to read all rows — no write access
CREATE POLICY "public_read_experience"               ON experience               FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_experience_tags"          ON experience_tags          FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_projects"                 ON projects                 FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_project_tags"             ON project_tags             FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_education"                ON education                FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_education_tags"           ON education_tags           FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_certifications"           ON certifications           FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_certification_tags"       ON certification_tags       FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_consulting_packs"         ON consulting_packs         FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_pack_features"            ON consulting_pack_features FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_pack_automations"         ON consulting_pack_automations FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_case_studies"             ON consulting_case_studies  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_case_study_tags"          ON consulting_case_study_tags FOR SELECT TO anon USING (true);
```

---

## CSV Files

All CSVs are generated by running `../generate_csvs.py` from this directory.

| File | Rows (approx.) | Primary Key | Foreign Key |
|---|---|---|---|
| `csvs/experience.csv` | 14 | `id` | — |
| `csvs/experience_tags.csv` | ~50 | `id` (auto) | `experience_id → experience.id` |
| `csvs/projects.csv` | 21 | `id` | — |
| `csvs/project_tags.csv` | ~80 | `id` (auto) | `project_id → projects.id` |
| `csvs/education.csv` | ~10 | `id` (auto) | — |
| `csvs/education_tags.csv` | ~20 | `id` (auto) | `education_id → education.id` |
| `csvs/certifications.csv` | ~400 | `id` (auto) | — |
| `csvs/certification_tags.csv` | ~600 | `id` (auto) | `certification_id → certifications.id` |
| `csvs/consulting_packs.csv` | 3 | `id` (string) | — |
| `csvs/consulting_pack_features.csv` | ~30 | `id` (auto) | `pack_id → consulting_packs.id` |
| `csvs/consulting_pack_automations.csv` | ~15 | `id` (auto) | `pack_id → consulting_packs.id` |
| `csvs/consulting_case_studies.csv` | ~5 | `id` (string) | — |
| `csvs/consulting_case_study_tags.csv` | ~15 | `id` (auto) | `case_study_id → consulting_case_studies.id` |

---

## Import Order (respect foreign key constraints)

Import CSVs in this exact order via Supabase Dashboard → Table Editor → Import CSV:

1. `experience.csv`
2. `experience_tags.csv`
3. `projects.csv`
4. `project_tags.csv`
5. `education.csv`
6. `education_tags.csv`
7. `certifications.csv`
8. `certification_tags.csv`
9. `consulting_packs.csv`
10. `consulting_pack_features.csv`
11. `consulting_pack_automations.csv`
12. `consulting_case_studies.csv`
13. `consulting_case_study_tags.csv`

---

## Client Integration (Next.js)

### Step 1 — Install SDK
```bash
cd cv && npm install @supabase/supabase-js
```

### Step 2 — Create `cv/src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

// These are safe to commit: anon key is read-only and RLS enforced
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Step 3 — Example: fetch experience with tags
```typescript
const { data: experience } = await supabase
  .from('experience')
  .select('*, experience_tags(tag)')
  .order('sort_order');
```

### Step 4 — Migrate one component at a time

Recommended order (lowest risk first):
1. `Experience` component — largest dataset, most benefit
2. `Projects` component — benefits from server-side tag filtering
3. `Education` component
4. `Certifications` component
5. Consulting packs + case studies

---

## Execution Steps (completed ✅)

```bash
# 1. Generate CSVs
cd tasks && python3 generate_csvs.py

# 2. Run schema.sql in Supabase SQL Editor

# 3. Run seed.sql in Supabase SQL Editor (or import CSVs via dashboard)

# 4. Install SDK
cd cv && npm install @supabase/supabase-js

# 5. Configure env vars in cv/.env.local (see Security section below)

# 6. Components migrated: Experience, Projects, Education, Certifications,
#    ConsultingPacks, CaseStudies — all via SupabaseDataContext
```

---

## Current State (as of 2026-02-23)

| Layer | Status |
|---|---|
| Supabase tables | ✅ Created (13 tables) |
| Seed data | ✅ Loaded via `seed.sql` |
| SDK installed | ✅ `@supabase/supabase-js` |
| Client | ✅ `cv/src/lib/supabase.ts` |
| Query functions | ✅ `cv/src/lib/queries.ts` |
| Data context | ✅ `cv/src/contexts/SupabaseDataContext.tsx` |
| Components migrated | ✅ Experience, Projects, Education, Certifications |
| content.json cleaned | ✅ Removed migrated arrays; only meta/about/techStack/consulting static fields remain |
| Secrets managed | ✅ Via `.env.local` locally + GitHub Actions secrets in production |

---

## Security Model

Credentials are **never hardcoded in source**:

- **Local dev**: `cv/.env.local` (gitignored)
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```
- **Production (GitHub Actions)**: Repository secrets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Set at: GitHub repo → Settings → Secrets and variables → Actions

The anon key is inherently public (designed for browser use), protected by RLS policies that only allow `SELECT` for the `anon` role. **Never use the `service_role` key on the frontend.**

---

## How to Add New Records

### Adding a new experience entry

**1. In Supabase SQL Editor:**
```sql
-- Insert the experience row
INSERT INTO experience (id, date_es, date_en, title_es, title_en, company, description_es, description_en, sort_order)
VALUES (
  15,                          -- next available id
  'Mar 2026 - actualidad',
  'Mar 2026 - Present',
  'Tu Nuevo Rol',
  'Your New Role',
  'Company Name',
  '<li>Descripción en español...</li>',
  '<li>English description...</li>',
  0                            -- 0 = first; increment existing sort_orders if needed
);

-- Insert tags for that experience
INSERT INTO experience_tags (experience_id, tag) VALUES
  (15, 'Python'),
  (15, 'SQL');
```

**2. No code changes needed.** The `SupabaseDataContext` fetches on every page load.

---

### Adding a new project

```sql
INSERT INTO projects (id, title_es, title_en, description_es, description_en, link, sort_order)
VALUES (
  23,
  'Nombre del Proyecto',
  'Project Name',
  'Descripción en español.',
  'English description.',
  'https://github.com/Mgobeaalcoba/repo',
  0
);

INSERT INTO project_tags (project_id, tag) VALUES
  (23, 'Python'),
  (23, 'FastAPI');
```

---

### Adding a new education entry

```sql
INSERT INTO education (title_es, title_en, school, date, subtitle_es, subtitle_en, sort_order)
VALUES (
  'Nombre del Título',
  'Degree Name',
  'Universidad X',
  '2026',
  NULL, NULL,   -- optional subtitle
  8             -- after existing entries
);
```

---

### Adding a new certification

```sql
-- Get the next id
SELECT MAX(id) + 1 FROM certifications;

INSERT INTO certifications (id, name, sort_order) VALUES (111, 'Nombre del Certificado', 110);
INSERT INTO certification_tags (certification_id, tag) VALUES (111, 'Python');
```

---

### Adding a consulting pack

```sql
INSERT INTO consulting_packs (id, name_es, name_en, subtitle_es, subtitle_en, description_es, description_en, price_es, price_en, highlighted, sort_order)
VALUES (
  'nuevo-pack',
  'Nombre del Pack',
  'Pack Name',
  'Subtítulo',
  'Subtitle',
  'Descripción',
  'Description',
  'Desde $XXX/mes',
  'From $XXX/month',
  false,
  3
);

-- Add features
INSERT INTO consulting_pack_features (pack_id, text_es, text_en, sort_order) VALUES
  ('nuevo-pack', '✅ Feature en español', '✅ Feature in English', 0);

-- Add automations
INSERT INTO consulting_pack_automations (pack_id, text_es, text_en, sort_order) VALUES
  ('nuevo-pack', '🤖 Automatización X', '🤖 Automation X', 0);
```

---

### Updating existing records

Use standard SQL `UPDATE`:

```sql
-- Example: update a job description
UPDATE experience
SET description_es = '<li>Nueva descripción actualizada</li>',
    description_en = '<li>Updated English description</li>'
WHERE id = 1;

-- Example: add a new tag to a project
INSERT INTO project_tags (project_id, tag) VALUES (5, 'Docker');

-- Example: change sort order (move experience to top)
UPDATE experience SET sort_order = 0 WHERE id = 15;
UPDATE experience SET sort_order = sort_order + 1 WHERE id != 15;
```

---

### Bulk updates from content.json

If you update `content.json` (for non-Supabase data like techStack, meta), regenerate the CSVs and re-seed only the affected tables:

```bash
cd tasks && python3 generate_csvs.py

# Then in Supabase SQL Editor:
# TRUNCATE experience CASCADE;
# TRUNCATE projects CASCADE;
# -- (paste relevant INSERT block from seed.sql)
```

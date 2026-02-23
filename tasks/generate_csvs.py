#!/usr/bin/env python3
"""
generate_csvs.py
Reads cv/src/data/content.json and generates all 13 CSV files required
for the Supabase migration into tasks/supabase-migration/csvs/.

Run from the repo root:
    python3 tasks/generate_csvs.py
"""

import csv
import json
import os

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT   = os.path.dirname(SCRIPT_DIR)
CONTENT_PATH = os.path.join(REPO_ROOT, "cv", "src", "data", "content.json")
OUTPUT_DIR   = os.path.join(SCRIPT_DIR, "supabase-migration", "csvs")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------
with open(CONTENT_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def write_csv(filename: str, fieldnames: list, rows: list) -> None:
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print(f"  ✓  {filename}  ({len(rows)} rows)")


# ---------------------------------------------------------------------------
# 1. experience
# ---------------------------------------------------------------------------
experience_rows = []
for i, exp in enumerate(data["experience"]):
    experience_rows.append({
        "id":             exp["id"],
        "date_es":        exp["date"]["es"],
        "date_en":        exp["date"]["en"],
        "title_es":       exp["title"]["es"],
        "title_en":       exp["title"]["en"],
        "company":        exp["company"],
        "description_es": exp["description"]["es"],
        "description_en": exp["description"]["en"],
        "sort_order":     i,
    })

write_csv("experience.csv",
    ["id","date_es","date_en","title_es","title_en","company","description_es","description_en","sort_order"],
    experience_rows)

# ---------------------------------------------------------------------------
# 2. experience_tags
# ---------------------------------------------------------------------------
experience_tag_rows = []
tag_id = 1
for exp in data["experience"]:
    for tag in exp.get("tags", []):
        experience_tag_rows.append({"id": tag_id, "experience_id": exp["id"], "tag": tag})
        tag_id += 1

write_csv("experience_tags.csv", ["id","experience_id","tag"], experience_tag_rows)

# ---------------------------------------------------------------------------
# 3. projects
# ---------------------------------------------------------------------------
project_rows = []
for i, proj in enumerate(data["projects"]):
    project_rows.append({
        "id":             proj["id"],
        "title_es":       proj["title"]["es"],
        "title_en":       proj["title"]["en"],
        "description_es": proj["description"]["es"],
        "description_en": proj["description"]["en"],
        "link":           proj.get("link", ""),
        "sort_order":     i,
    })

write_csv("projects.csv",
    ["id","title_es","title_en","description_es","description_en","link","sort_order"],
    project_rows)

# ---------------------------------------------------------------------------
# 4. project_tags
# ---------------------------------------------------------------------------
project_tag_rows = []
tag_id = 1
for proj in data["projects"]:
    for tag in proj.get("tags", []):
        project_tag_rows.append({"id": tag_id, "project_id": proj["id"], "tag": tag})
        tag_id += 1

write_csv("project_tags.csv", ["id","project_id","tag"], project_tag_rows)

# ---------------------------------------------------------------------------
# 5. education  (no native id — generate serial)
# ---------------------------------------------------------------------------
education_rows = []
for i, edu in enumerate(data["education"]):
    education_rows.append({
        "id":          i + 1,
        "title_es":    edu["title"]["es"],
        "title_en":    edu["title"]["en"],
        "school":      edu["school"],
        "date":        edu["date"],
        "subtitle_es": edu.get("subtitle", {}).get("es", ""),
        "subtitle_en": edu.get("subtitle", {}).get("en", ""),
        "sort_order":  i,
    })

write_csv("education.csv",
    ["id","title_es","title_en","school","date","subtitle_es","subtitle_en","sort_order"],
    education_rows)

# ---------------------------------------------------------------------------
# 6. education_tags
# ---------------------------------------------------------------------------
education_tag_rows = []
tag_id = 1
for i, edu in enumerate(data["education"]):
    edu_id = i + 1
    for tag in edu.get("tags", []):
        education_tag_rows.append({"id": tag_id, "education_id": edu_id, "tag": tag})
        tag_id += 1

write_csv("education_tags.csv", ["id","education_id","tag"], education_tag_rows)

# ---------------------------------------------------------------------------
# 7. certifications  (no native id — generate serial)
# ---------------------------------------------------------------------------
certification_rows = []
for i, cert in enumerate(data["certifications"]):
    certification_rows.append({
        "id":         i + 1,
        "name":       cert["name"],
        "sort_order": i,
    })

write_csv("certifications.csv", ["id","name","sort_order"], certification_rows)

# ---------------------------------------------------------------------------
# 8. certification_tags
# ---------------------------------------------------------------------------
certification_tag_rows = []
tag_id = 1
for i, cert in enumerate(data["certifications"]):
    cert_id = i + 1
    for tag in cert.get("tags", []):
        certification_tag_rows.append({"id": tag_id, "certification_id": cert_id, "tag": tag})
        tag_id += 1

write_csv("certification_tags.csv", ["id","certification_id","tag"], certification_tag_rows)

# ---------------------------------------------------------------------------
# 9. consulting_packs
# ---------------------------------------------------------------------------
packs = data["consulting"]["packs"]
pack_rows = []
for i, pack in enumerate(packs):
    badge = pack.get("badge", {}) or {}
    pack_rows.append({
        "id":             pack["id"],
        "name_es":        pack["name"]["es"],
        "name_en":        pack["name"]["en"],
        "subtitle_es":    pack["subtitle"]["es"],
        "subtitle_en":    pack["subtitle"]["en"],
        "description_es": pack["description"]["es"],
        "description_en": pack["description"]["en"],
        "price_es":       pack["price"]["es"],
        "price_en":       pack["price"]["en"],
        "highlighted":    "true" if pack.get("highlighted") else "false",
        "badge_es":       badge.get("es", ""),
        "badge_en":       badge.get("en", ""),
        "sort_order":     i,
    })

write_csv("consulting_packs.csv",
    ["id","name_es","name_en","subtitle_es","subtitle_en","description_es","description_en",
     "price_es","price_en","highlighted","badge_es","badge_en","sort_order"],
    pack_rows)

# ---------------------------------------------------------------------------
# 10. consulting_pack_features
# ---------------------------------------------------------------------------
pack_feature_rows = []
row_id = 1
for pack in packs:
    for j, feat in enumerate(pack.get("features", [])):
        pack_feature_rows.append({
            "id":         row_id,
            "pack_id":    pack["id"],
            "text_es":    feat["es"],
            "text_en":    feat["en"],
            "sort_order": j,
        })
        row_id += 1

write_csv("consulting_pack_features.csv",
    ["id","pack_id","text_es","text_en","sort_order"], pack_feature_rows)

# ---------------------------------------------------------------------------
# 11. consulting_pack_automations
# ---------------------------------------------------------------------------
pack_automation_rows = []
row_id = 1
for pack in packs:
    for j, auto in enumerate(pack.get("automations", [])):
        pack_automation_rows.append({
            "id":         row_id,
            "pack_id":    pack["id"],
            "text_es":    auto["es"],
            "text_en":    auto["en"],
            "sort_order": j,
        })
        row_id += 1

write_csv("consulting_pack_automations.csv",
    ["id","pack_id","text_es","text_en","sort_order"], pack_automation_rows)

# ---------------------------------------------------------------------------
# 12. consulting_case_studies
# ---------------------------------------------------------------------------
case_studies = data["consulting"].get("caseStudies", [])
case_study_rows = []
for i, cs in enumerate(case_studies):
    case_study_rows.append({
        "id":             cs["id"],
        "title_es":       cs["title"]["es"],
        "title_en":       cs["title"]["en"],
        "description_es": cs["description"]["es"],
        "description_en": cs["description"]["en"],
        "result_es":      cs["result"]["es"],
        "result_en":      cs["result"]["en"],
        "image":          cs.get("image", ""),
        "sort_order":     i,
    })

write_csv("consulting_case_studies.csv",
    ["id","title_es","title_en","description_es","description_en","result_es","result_en","image","sort_order"],
    case_study_rows)

# ---------------------------------------------------------------------------
# 13. consulting_case_study_tags
# ---------------------------------------------------------------------------
cs_tag_rows = []
tag_id = 1
for cs in case_studies:
    for tag in cs.get("tags", []):
        cs_tag_rows.append({"id": tag_id, "case_study_id": cs["id"], "tag": tag})
        tag_id += 1

write_csv("consulting_case_study_tags.csv",
    ["id","case_study_id","tag"], cs_tag_rows)

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
print(f"\nAll CSVs written to: {OUTPUT_DIR}")

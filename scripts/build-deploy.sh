#!/bin/bash
# ============================================================
# Cloudflare Pages unified build script
# Builds all three Next.js sites and assembles them into _site/
#
# Cloudflare Pages settings:
#   Build command : bash scripts/build-deploy.sh
#   Output dir    : _site
# ============================================================
set -e

echo "▶ Installing workspace dependencies..."
npm ci

echo "▶ Building all sites..."
npm run build:all

echo "▶ Assembling output into _site/ ..."
rm -rf _site
mkdir -p _site

# CV is the root
cp -r apps/web/out/. _site/

# Sub-sites go into their respective subdirectories
mkdir -p _site/neil-site
cp -r apps/neil/out/. _site/neil-site/

mkdir -p _site/elportugues-site
cp -r apps/el-portugues/out/. _site/elportugues-site/

# GitHub Pages compatibility marker. Cloudflare safely ignores it.
touch _site/.nojekyll

echo "✓ Build complete. Directory structure:"
ls -la _site/

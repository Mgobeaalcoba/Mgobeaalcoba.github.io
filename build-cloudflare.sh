#!/bin/bash
# ============================================================
# Cloudflare Pages unified build script
# Builds all three Next.js sites and assembles them into _site/
#
# Cloudflare Pages settings:
#   Build command : bash build-cloudflare.sh
#   Output dir    : _site
# ============================================================
set -e

echo "▶ Building Neil site..."
cd neil
npm ci
npm run build
cd ..

echo "▶ Building El Portugués site..."
cd elportugues
npm ci
npm run build
cd ..

echo "▶ Building CV site..."
cd cv
npm ci
npm run build
cd ..

echo "▶ Assembling output into _site/ ..."
rm -rf _site
mkdir -p _site

# CV is the root
cp -r cv/out/. _site/

# Sub-sites go into their respective subdirectories
mkdir -p _site/neil-site
cp -r neil/out/. _site/neil-site/

mkdir -p _site/elportugues-site
cp -r elportugues/out/. _site/elportugues-site/

echo "✓ Build complete. Directory structure:"
ls -la _site/

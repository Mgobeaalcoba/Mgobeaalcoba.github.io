#!/bin/bash
# Backward-compatible Cloudflare Pages entrypoint.
# The canonical deployment logic lives in scripts/build-deploy.sh.
set -e

exec bash scripts/build-deploy.sh

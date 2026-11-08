#!/bin/sh
# Preserve any existing hook; never replace another developer's checks.
set -eu
cd "$(git rev-parse --show-toplevel)"
hook_path=$(git rev-parse --git-path hooks/pre-commit)
if [ -e "$hook_path" ]; then
  echo "Existing pre-commit hook preserved; add python3 scripts/scan_secrets.py --staged to it if needed."
  exit 0
fi
mkdir -p "$(dirname "$hook_path")"
cat > "$hook_path" <<'HOOK'
#!/bin/sh
python3 scripts/scan_secrets.py --staged
HOOK
chmod +x "$hook_path"
echo "Secret-scan pre-commit hook installed."

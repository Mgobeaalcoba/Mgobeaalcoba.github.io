#!/usr/bin/env python3
"""Scan version-controlled content (or the staged index) without printing secrets."""
import argparse
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PATTERNS = [
    re.compile(r"(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}"),
    re.compile(r"sk-(?:proj-)?[A-Za-z0-9_-]{24,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{16,}"),
]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--staged", action="store_true", help="Scan the index used by the next commit")
    args = parser.parse_args()
    files = git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z") if args.staged else git("ls-files", "-z")
    findings = []
    for raw in files.split(b"\0"):
        if not raw:
            continue
        name = raw.decode("utf-8", errors="surrogateescape")
        path = ROOT / name
        if not args.staged and (not path.is_file() or path.is_symlink()):
            continue
        content = git("show", f":{name}") if args.staged else path.read_bytes()
        if b"\0" in content[:8192]:
            continue
        for number, line in enumerate(content.decode("utf-8", errors="replace").splitlines(), 1):
            if any(pattern.search(line) for pattern in PATTERNS):
                findings.append(f"{name}:{number}: possible credential (value redacted)")
    if findings:
        print("\n".join(findings), file=sys.stderr)
        return 1
    print("OK: sin secretos detectados en el contenido " + ("staged" if args.staged else "versionado"))
    return 0


if __name__ == "__main__":
    sys.exit(main())

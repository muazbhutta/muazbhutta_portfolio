#!/usr/bin/env bash
set -u
PATTERNS=(
  "AKIA[0-9A-Z]{16}"
  "-----BEGIN( RSA| EC| OPENSSH)? PRIVATE KEY-----"
  "ghp_[A-Za-z0-9]{36}"
  "glpat-[A-Za-z0-9_-]{20,}"
)
FOUND=0
for p in "${PATTERNS[@]}"; do
  hits=$(grep -rInE --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="secret-scan.sh" -e "$p" . || true)
  if [ -n "$hits" ]; then
    echo "POTENTIAL SECRET FOUND (pattern: $p):"
    echo "$hits"
    FOUND=1
  fi
done
if [ "$FOUND" -eq 1 ]; then
  echo "SECRET SCAN FAILED"
  exit 1
fi
echo "SECRET SCAN PASSED - no credentials detected"

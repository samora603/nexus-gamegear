#!/usr/bin/env bash
# Reproducibly extract Canva PNG exports from design/game gear.zip
# for development reference. Extracted files are TEMPORARY dev assets.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ZIP="$ROOT/design/game gear.zip"
OUT="$ROOT/src/assets/dev/canva-exports"

if [[ ! -f "$ZIP" ]]; then
  echo "Error: design asset not found at $ZIP" >&2
  exit 1
fi

mkdir -p "$OUT"
unzip -o "$ZIP" -d "$OUT"
echo "Extracted Canva exports to $OUT"
echo "These are temporary development assets — not production-ready."

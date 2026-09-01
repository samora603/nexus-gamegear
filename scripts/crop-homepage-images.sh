#!/usr/bin/env bash
# Crop homepage sections from Canva export 1.png for development use.
# Output: src/assets/images/home/ (temporary Canva-derived assets)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/assets/dev/canva-exports/1.png"
OUT="$ROOT/src/assets/images/home"

if [[ ! -f "$SRC" ]]; then
  echo "Run scripts/extract-design-images.sh first" >&2
  exit 1
fi

mkdir -p "$OUT"

crop() {
  local name="$1"
  local geom="$2"
  magick "$SRC" -crop "$geom" +repage -quality 85 "$OUT/$name.webp"
  echo "  $name.webp"
}

echo "Cropping homepage assets from 1.png..."

# Hero (desk + pink panel area, full width)
crop "hero-background" "1366x720+0+0"

# Phone mockup (right side of hero)
crop "hero-phone" "420x680+920+30"

# Feature card images (three square crops)
crop "feature-ai" "400x400+40+780"
crop "feature-gaming" "400x400+480+780"
crop "feature-audio" "400x400+920+780"

# Feature section soundboard background
crop "feature-section-bg" "1366x520+0+1220"

# Promo banner background
crop "promo-banner-bg" "1366x420+0+2920"

# Contact photo grid (right panel)
crop "contact-grid" "680x1180+686+3420"

# Category card thumbnail hints (small crops from design cards)
crop "category-communication" "200x200+60+2180"
crop "category-entertainment" "200x200+280+2180"
crop "category-computer" "200x200+500+2180"
crop "category-wearable" "200x200+720+2180"
crop "category-photography" "200x200+940+2180"
crop "category-power" "200x200+1100+1980"

echo "Done → $OUT"

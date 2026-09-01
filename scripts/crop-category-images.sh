#!/usr/bin/env bash
# Crop collage images from Canva category exports (2.png – 7.png).
# Output: src/assets/images/category/{slug}/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/src/assets/dev/canva-exports"
OUT_BASE="$ROOT/src/assets/images/category"

crop() {
  local src="$1"
  local out="$2"
  local geom="$3"
  mkdir -p "$(dirname "$out")"
  magick "$src" -crop "$geom" +repage -quality 85 "$out"
  echo "  $(basename "$(dirname "$out")")/$(basename "$out")"
}

echo "Cropping category collage assets..."

# Communication (2.png)
SRC="$SRC_DIR/2.png"
OUT="$OUT_BASE/communication-gadgets"
crop "$SRC" "$OUT/primary-collage.webp" "560x620+420+90"
crop "$SRC" "$OUT/overlay-hand.webp" "360x420+920+320"

# Entertainment (3.png)
SRC="$SRC_DIR/3.png"
OUT="$OUT_BASE/entertainment-gadgets"
crop "$SRC" "$OUT/tv-main.webp" "520x380+430+180"
crop "$SRC" "$OUT/vintage-tvs.webp" "380x280+880+40"
crop "$SRC" "$OUT/headphones.webp" "320x360+340+380"
crop "$SRC" "$OUT/speakers.webp" "260x380+180+80"
crop "$SRC" "$OUT/playstation.webp" "360x300+780+430"

# Computer (4.png)
SRC="$SRC_DIR/4.png"
OUT="$OUT_BASE/computer-gadgets"
crop "$SRC" "$OUT/printer-main.webp" "520x480+400+120"
crop "$SRC" "$OUT/desk-setup.webp" "220x520+280+80"
crop "$SRC" "$OUT/desktop-setup.webp" "380x300+780+420"
crop "$SRC" "$OUT/floor-printer.webp" "320x240+520+520"

# Wearable (5.png)
SRC="$SRC_DIR/5.png"
OUT="$OUT_BASE/wearable-gadgets"
crop "$SRC" "$OUT/watch-main.webp" "480x520+420+120"
crop "$SRC" "$OUT/smart-glasses.webp" "340x280+280+380"
crop "$SRC" "$OUT/watch-strap.webp" "200x320+920+60"
crop "$SRC" "$OUT/watch-secondary.webp" "240x240+820+460"

# Photography (6.png)
SRC="$SRC_DIR/6.png"
OUT="$OUT_BASE/photography-gadgets"
crop "$SRC" "$OUT/drone-main.webp" "560x400+480+120"
crop "$SRC" "$OUT/action-camera.webp" "320x340+300+380"
crop "$SRC" "$OUT/leica-camera.webp" "380x320+520+420"
crop "$SRC" "$OUT/gear-layout.webp" "180x480+1080+80"

# Power & Charging (7.png)
SRC="$SRC_DIR/7.png"
OUT="$OUT_BASE/power-charging-gadgets"
crop "$SRC" "$OUT/wireless-charger.webp" "480x480+440+160"
crop "$SRC" "$OUT/power-banks.webp" "320x280+380+40"
crop "$SRC" "$OUT/bow-charger.webp" "240x360+620+60"
crop "$SRC" "$OUT/lavender-charger.webp" "300x260+360+420"
crop "$SRC" "$OUT/charging-pads.webp" "200x420+980+180"

echo "Done → $OUT_BASE"

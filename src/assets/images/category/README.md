# Category Page Images

**Status:** Temporary Canva-derived crops — not production-ready.

## Source

```bash
bash scripts/extract-design-images.sh
bash scripts/crop-category-images.sh
```

Original exports: `src/assets/dev/canva-exports/2.png` – `7.png`

## Structure

Each subdirectory matches a category slug and contains collage image crops used by `CategoryImageCollage`.

Positioning and layering are configured in `src/data/category-collages.ts`.

## Production

Replace with licensed individual assets before launch. Decorative panels (gradients, overlays) are implemented in CSS/Tailwind.

export interface CollageImage {
  id: string
  src: string
  alt: string
  className: string
  decorative?: boolean
}

export interface CollagePanel {
  id: string
  className: string
}

export interface CollageOverlayText {
  primary: string
  secondary?: string
  className: string
}

export interface CategoryCollageConfig {
  containerClassName?: string
  images: CollageImage[]
  panels?: CollagePanel[]
  overlayText?: CollageOverlayText
}

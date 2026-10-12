import type { PictureAsset } from '../../data/images'
import styles from './Picture.module.css'

type Props = {
  image: PictureAsset
  className?: string
}

function srcSet(name: string, widths: readonly number[], format: 'avif' | 'webp') {
  return widths.map((width) => `/images/${name}-${width}.${format} ${width}w`).join(', ')
}

export function Picture({ image, className }: Props) {
  const { name, alt, width, height, widths, sizes, priority } = image

  return (
    <picture className={className ? `${styles.picture} ${className}` : styles.picture}>
      <source type="image/avif" srcSet={srcSet(name, widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, widths, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}.jpg`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}

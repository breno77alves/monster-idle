import type { SyntheticEvent } from 'react'
import type { MonsterSpecies } from '../../domain/monster-types'

interface MonsterPortraitProps {
  readonly species: MonsterSpecies
  readonly alt: string
  readonly className?: string
}

export function MonsterPortrait({
  species,
  alt,
  className,
}: MonsterPortraitProps) {
  const localPrototypePath = `/local-prototype/${species.id}.png`
  const source = import.meta.env.DEV ? localPrototypePath : species.portraitPath

  const useOriginalFallback = (event: SyntheticEvent<HTMLImageElement>) => {
    if (event.currentTarget.getAttribute('src') !== species.portraitPath) {
      event.currentTarget.src = species.portraitPath
    }
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={useOriginalFallback}
      src={source}
    />
  )
}

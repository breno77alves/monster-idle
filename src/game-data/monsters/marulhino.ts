import type { MonsterSpecies } from '../../domain/monster-types'

export const marulhino = {
  id: 'marulhino',
  name: 'Marulhino',
  description:
    'Uma forma d’água brincalhona que carrega gotas puras em pequenas bolsas translúcidas.',
  types: ['aquatico'],
  role: 'support',
  baseStats: { health: 47, attack: 8, defense: 10, speed: 12 },
  abilityIds: ['orvalho-calmo', 'corrente-favoravel'],
  passiveId: 'frescor-continuo',
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

import type { MonsterSpecies } from '../../domain/monster-types'

export const cascomar = {
  id: 'cascomar',
  name: 'Cascomar',
  description:
    'Um habitante de poças profundas cuja concha mineral desvia impactos e guarda umidade.',
  types: ['aquatico'],
  role: 'tank',
  baseStats: { health: 60, attack: 9, defense: 17, speed: 5 },
  abilityIds: ['barreira-de-mare', 'onda-de-retorno'],
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

import type { MonsterSpecies } from '../../domain/monster-types'

export const fornalho = {
  id: 'fornalho',
  name: 'Fornalho',
  description:
    'Uma criatura compacta de argila escura que conserva calor sob uma couraça resistente.',
  types: ['chama'],
  role: 'tank',
  baseStats: { health: 58, attack: 10, defense: 16, speed: 6 },
  abilityIds: ['muralha-de-cinza', 'pulso-da-forja'],
  passiveId: 'casco-termico',
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

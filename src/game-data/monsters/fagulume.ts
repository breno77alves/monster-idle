import type { MonsterSpecies } from '../../domain/monster-types'

export const fagulume = {
  id: 'fagulume',
  name: 'Fagulume',
  description:
    'Uma centelha curiosa que flutua entre pedras quentes e ilumina trilhas escuras.',
  types: ['chama'],
  role: 'damage',
  baseStats: { health: 42, attack: 15, defense: 8, speed: 13 },
  abilityIds: ['salto-de-brasa', 'rastro-cintilante'],
  passiveId: 'calor-persistente',
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

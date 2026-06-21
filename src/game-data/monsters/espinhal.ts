import type { MonsterSpecies } from '../../domain/monster-types'

export const espinhal = {
  id: 'espinhal',
  name: 'Espinhal',
  description:
    'Um corredor de galhos flexíveis que transforma movimento em rajadas de espinhos leves.',
  types: ['natureza'],
  role: 'damage',
  baseStats: { health: 44, attack: 14, defense: 9, speed: 14 },
  abilityIds: ['disparo-de-espinho', 'passo-rasteiro'],
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

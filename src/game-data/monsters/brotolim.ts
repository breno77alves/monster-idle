import type { MonsterSpecies } from '../../domain/monster-types'

export const brotolim = {
  id: 'brotolim',
  name: 'Brotolim',
  description:
    'Um pequeno guardião de sementes que percebe mudanças no solo antes de qualquer outro ser.',
  types: ['natureza'],
  role: 'support',
  baseStats: { health: 46, attack: 8, defense: 11, speed: 10 },
  abilityIds: ['seiva-renovadora', 'polen-guia'],
  passiveId: 'raiz-produtiva',
  portraitPath: '/monsters/placeholder.svg',
} as const satisfies MonsterSpecies

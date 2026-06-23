import type { BattleInput, CombatAbility } from '../simulation/battle'
import {
  brotolim,
  cascomar,
  espinhal,
  fagulume,
  fornalho,
  marulhino,
} from './monsters'

const emberLeap: CombatAbility = {
  id: 'salto-de-brasa',
  name: 'Salto de Brasa',
  power: 1.15,
}

const guidingPollen: CombatAbility = {
  id: 'polen-guia',
  name: 'Pólen Guia',
  power: 0.9,
  effect: { kind: 'buff', stat: 'attack', amount: 0.1 },
}

const returningWave: CombatAbility = {
  id: 'onda-de-retorno',
  name: 'Onda de Retorno',
  power: 1,
}

const wildCharge: CombatAbility = {
  id: 'investida-selvagem',
  name: 'Investida Selvagem',
  power: 0.65,
}

export const demoBattleInput = {
  playerTeam: [
    {
      id: fagulume.id,
      name: fagulume.name,
      stats: fagulume.baseStats,
      abilities: [emberLeap],
    },
    {
      id: brotolim.id,
      name: brotolim.name,
      stats: brotolim.baseStats,
      abilities: [guidingPollen],
    },
    {
      id: cascomar.id,
      name: cascomar.name,
      stats: cascomar.baseStats,
      abilities: [returningWave],
    },
  ],
  enemyTeam: [
    {
      id: fornalho.id,
      name: fornalho.name,
      stats: { health: 24, attack: 7, defense: 6, speed: 8 },
      abilities: [wildCharge],
    },
    {
      id: espinhal.id,
      name: espinhal.name,
      stats: { health: 20, attack: 8, defense: 4, speed: 11 },
      abilities: [wildCharge],
    },
    {
      id: marulhino.id,
      name: marulhino.name,
      stats: { health: 22, attack: 6, defense: 5, speed: 9 },
      abilities: [wildCharge],
    },
  ],
  rewards: [{ itemId: 'fragmento-de-pedra', quantity: 2 }],
  seed: 2_026_06_22,
} as const satisfies BattleInput

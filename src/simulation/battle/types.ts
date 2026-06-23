import type { AbilityEffect, MonsterStats } from '../../domain/monster-types'

export interface CombatAbility {
  readonly id: string
  readonly name: string
  readonly power: number
  readonly effect?: AbilityEffect
}

export interface CombatUnit {
  readonly id: string
  readonly name: string
  readonly stats: MonsterStats
  readonly abilities: readonly CombatAbility[]
}

export type BattleSide = 'player' | 'enemy'
export type BattleWinner = BattleSide | 'draw'

export interface BattleReward {
  readonly itemId: string
  readonly quantity: number
}

export interface BattleInput {
  readonly playerTeam: readonly CombatUnit[]
  readonly enemyTeam: readonly CombatUnit[]
  readonly seed: number
  readonly rewards?: readonly BattleReward[]
}

export interface BattleAction {
  readonly actorId: string
  readonly actorSide: BattleSide
  readonly targetId: string
  readonly abilityId: string
  readonly damage: number
  readonly targetHealth: number
}

export interface BattleRound {
  readonly number: number
  readonly actions: readonly BattleAction[]
}

export interface BattleResult {
  readonly winner: BattleWinner
  readonly rounds: readonly BattleRound[]
  readonly log: readonly string[]
  readonly rewards?: readonly BattleReward[]
}

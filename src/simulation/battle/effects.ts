import type { AbilityEffect, MonsterStats } from '../../domain/monster-types'
import type { BattleSide, CombatAbility, CombatUnit } from './types'

type MutableStats = { -readonly [Stat in keyof MonsterStats]: number }

export interface MutableCombatUnit {
  readonly id: string
  readonly name: string
  readonly side: BattleSide
  readonly abilities: readonly CombatAbility[]
  readonly stats: MutableStats
  maxHealth: number
}

export function cloneCombatUnit(
  unit: CombatUnit,
  side: BattleSide,
): MutableCombatUnit {
  return {
    id: unit.id,
    name: unit.name,
    side,
    abilities: unit.abilities.map((ability) => ({ ...ability })),
    stats: { ...unit.stats },
    maxHealth: unit.stats.health,
  }
}

function applyStatChange(
  unit: MutableCombatUnit,
  stat: keyof MonsterStats,
  multiplier: number,
) {
  if (stat === 'health') {
    const previousMaxHealth = unit.maxHealth
    unit.maxHealth = Math.max(1, previousMaxHealth * multiplier)

    if (multiplier > 1) {
      unit.stats.health += unit.maxHealth - previousMaxHealth
    } else {
      unit.stats.health = Math.min(unit.stats.health, unit.maxHealth)
    }
    return
  }

  unit.stats[stat] = Math.max(0, unit.stats[stat] * multiplier)
}

export function applyAbilityEffect(
  effect: AbilityEffect | undefined,
  actor: MutableCombatUnit,
  target: MutableCombatUnit,
) {
  if (!effect) return

  if (effect.kind === 'heal') {
    actor.stats.health = Math.min(
      actor.maxHealth,
      actor.stats.health + effect.amount,
    )
    return
  }

  if (effect.kind === 'buff') {
    applyStatChange(actor, effect.stat, 1 + effect.amount)
    return
  }

  if (target.stats.health > 0) {
    applyStatChange(target, effect.stat, Math.max(0, 1 - effect.amount))
  }
}

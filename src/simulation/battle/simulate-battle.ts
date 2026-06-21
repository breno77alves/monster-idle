import { calculateDamage } from './damage'
import {
  applyAbilityEffect,
  cloneCombatUnit,
  type MutableCombatUnit,
} from './effects'
import { createSeededRandom, type SeededRandom } from './random'
import type {
  BattleInput,
  BattleResult,
  BattleRound,
  BattleWinner,
} from './types'

const MAX_ROUNDS = 100

const isAlive = (unit: MutableCombatUnit) => unit.stats.health > 0

function getWinner(
  playerTeam: readonly MutableCombatUnit[],
  enemyTeam: readonly MutableCombatUnit[],
): BattleWinner | undefined {
  const playerAlive = playerTeam.some(isAlive)
  const enemyAlive = enemyTeam.some(isAlive)

  if (!playerAlive && !enemyAlive) return 'draw'
  if (!playerAlive) return 'enemy'
  if (!enemyAlive) return 'player'
  return undefined
}

function createTurnOrder(
  units: readonly MutableCombatUnit[],
  random: SeededRandom,
) {
  return units
    .filter(isAlive)
    .map((unit) => ({ unit, tieBreaker: random.next() }))
    .sort(
      (first, second) =>
        second.unit.stats.speed - first.unit.stats.speed ||
        first.tieBreaker - second.tieBreaker,
    )
    .map(({ unit }) => unit)
}

function finishBattle(
  winner: BattleWinner,
  rounds: readonly BattleRound[],
  log: readonly string[],
  input: BattleInput,
): BattleResult {
  const rewards =
    winner === 'player' && input.rewards
      ? input.rewards.map((reward) => ({ ...reward }))
      : undefined

  return { winner, rounds, log, ...(rewards ? { rewards } : {}) }
}

export function simulateBattle(input: BattleInput): BattleResult {
  const random = createSeededRandom(input.seed)
  const playerTeam = input.playerTeam.map((unit) =>
    cloneCombatUnit(unit, 'player'),
  )
  const enemyTeam = input.enemyTeam.map((unit) =>
    cloneCombatUnit(unit, 'enemy'),
  )
  const allUnits = [...playerTeam, ...enemyTeam]
  const rounds: BattleRound[] = []
  const log: string[] = []

  const initialWinner = getWinner(playerTeam, enemyTeam)
  if (initialWinner) return finishBattle(initialWinner, rounds, log, input)

  for (let roundNumber = 1; roundNumber <= MAX_ROUNDS; roundNumber += 1) {
    const actions: BattleRound['actions'][number][] = []
    const turnOrder = createTurnOrder(allUnits, random)
    log.push(`Rodada ${roundNumber}`)

    for (const actor of turnOrder) {
      if (!isAlive(actor) || actor.abilities.length === 0) continue

      const opponents = (
        actor.side === 'player' ? enemyTeam : playerTeam
      ).filter(isAlive)
      if (opponents.length === 0) break

      const ability = actor.abilities[random.nextInt(actor.abilities.length)]
      const target = opponents[random.nextInt(opponents.length)]
      if (!ability || !target) continue

      const damage = calculateDamage({
        attack: actor.stats.attack,
        power: ability.power,
        defense: target.stats.defense,
      })
      target.stats.health = Math.max(0, target.stats.health - damage)
      applyAbilityEffect(ability.effect, actor, target)

      actions.push({
        actorId: actor.id,
        actorSide: actor.side,
        targetId: target.id,
        abilityId: ability.id,
        damage,
        targetHealth: target.stats.health,
      })
      log.push(
        `${actor.name} usou ${ability.name} em ${target.name} e causou ${damage} de dano.`,
      )

      if (getWinner(playerTeam, enemyTeam)) break
    }

    rounds.push({ number: roundNumber, actions })
    const winner = getWinner(playerTeam, enemyTeam)
    if (winner) return finishBattle(winner, rounds, log, input)
  }

  return finishBattle('draw', rounds, log, input)
}

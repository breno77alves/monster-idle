import { simulateBattle } from '../../simulation/battle'
import type {
  BattleAction,
  BattleInput,
  BattleResult,
  BattleSide,
} from '../../simulation/battle'

export interface BattleUnitPresentation {
  readonly id: string
  readonly name: string
  readonly side: BattleSide
  readonly maxHealth: number
}

export interface BattleFrame {
  readonly roundNumber: number
  readonly currentAction?: BattleAction
  readonly healthByUnitId: Readonly<Record<string, number>>
  readonly visibleLog: readonly string[]
  readonly isComplete: boolean
}

export interface BattlePresentation {
  readonly units: readonly BattleUnitPresentation[]
  readonly frames: readonly BattleFrame[]
  readonly result: BattleResult
}

const damageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

function describeAction(action: BattleAction, input: BattleInput) {
  const combatUnits = [...input.playerTeam, ...input.enemyTeam]
  const actor = combatUnits.find((unit) => unit.id === action.actorId)
  const target = combatUnits.find((unit) => unit.id === action.targetId)
  const ability = actor?.abilities.find(
    (candidate) => candidate.id === action.abilityId,
  )

  return `${actor?.name ?? action.actorId} usou ${ability?.name ?? action.abilityId} em ${target?.name ?? action.targetId} e causou ${damageFormatter.format(action.damage)} de dano.`
}

export function createBattlePresentation(
  input: BattleInput,
): BattlePresentation {
  const result = simulateBattle(input)
  const units: BattleUnitPresentation[] = [
    ...input.playerTeam.map((unit) => ({
      id: unit.id,
      name: unit.name,
      side: 'player' as const,
      maxHealth: unit.stats.health,
    })),
    ...input.enemyTeam.map((unit) => ({
      id: unit.id,
      name: unit.name,
      side: 'enemy' as const,
      maxHealth: unit.stats.health,
    })),
  ]
  const healthByUnitId: Record<string, number> = Object.fromEntries(
    units.map((unit) => [unit.id, unit.maxHealth]),
  )
  const visibleLog: string[] = []
  const frames: BattleFrame[] = [
    {
      roundNumber: 0,
      healthByUnitId: { ...healthByUnitId },
      visibleLog: [],
      isComplete: false,
    },
  ]

  for (const round of result.rounds) {
    visibleLog.push(`Rodada ${round.number}`)

    for (const action of round.actions) {
      healthByUnitId[action.targetId] = action.targetHealth
      visibleLog.push(describeAction(action, input))

      frames.push({
        roundNumber: round.number,
        currentAction: action,
        healthByUnitId: { ...healthByUnitId },
        visibleLog: [...visibleLog],
        isComplete: false,
      })
    }
  }

  const finalFrameIndex = frames.length - 1
  const finalFrame = frames[finalFrameIndex]
  if (finalFrame) frames[finalFrameIndex] = { ...finalFrame, isComplete: true }

  return { units, frames, result }
}

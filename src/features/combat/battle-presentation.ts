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
  let logIndex = 0

  for (const round of result.rounds) {
    const roundHeader = result.log[logIndex]
    if (roundHeader) visibleLog.push(roundHeader)
    logIndex += 1

    for (const action of round.actions) {
      healthByUnitId[action.targetId] = action.targetHealth
      const actionLog = result.log[logIndex]
      if (actionLog) visibleLog.push(actionLog)
      logIndex += 1

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

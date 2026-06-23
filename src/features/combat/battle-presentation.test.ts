import { describe, expect, it } from 'vitest'
import { demoBattleInput } from '../../game-data/demo-battle'
import { createBattlePresentation } from './battle-presentation'

describe('createBattlePresentation', () => {
  it('turns a deterministic result into progressive health frames', () => {
    const presentation = createBattlePresentation(demoBattleInput)
    const actionCount = presentation.result.rounds.reduce(
      (total, round) => total + round.actions.length,
      0,
    )

    expect(presentation.units).toHaveLength(6)
    expect(presentation.frames).toHaveLength(actionCount + 1)
    expect(presentation.frames[0]?.roundNumber).toBe(0)
    expect(presentation.frames.at(-1)?.isComplete).toBe(true)
    expect(presentation.result.winner).toBe('player')
  })

  it('keeps rewards only in the completed result', () => {
    const presentation = createBattlePresentation(demoBattleInput)

    expect(presentation.frames[0]?.isComplete).toBe(false)
    expect(presentation.result.rewards).toEqual([
      { itemId: 'fragmento-de-pedra', quantity: 2 },
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { simulateBattle } from './simulate-battle'
import type { CombatAbility, CombatUnit } from './types'

const strike: CombatAbility = {
  id: 'golpe-basico',
  name: 'Golpe básico',
  power: 1,
}

function createUnit(
  id: string,
  stats: Partial<CombatUnit['stats']> = {},
  abilities: readonly CombatAbility[] = [strike],
): CombatUnit {
  return {
    id,
    name: id,
    stats: {
      health: 30,
      attack: 10,
      defense: 0,
      speed: 10,
      ...stats,
    },
    abilities,
  }
}

describe('simulateBattle', () => {
  it('returns a player victory when the player team eliminates the enemy', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('player', { attack: 20, speed: 20 })],
      enemyTeam: [createUnit('enemy', { health: 10 })],
      seed: 1,
    })

    expect(result.winner).toBe('player')
    expect(result.rounds).toHaveLength(1)
  })

  it('returns an enemy victory when the player team is eliminated', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('player', { health: 10 })],
      enemyTeam: [createUnit('enemy', { attack: 20, speed: 20 })],
      seed: 2,
    })

    expect(result.winner).toBe('enemy')
  })

  it('supports a team containing only one monster', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('solo', { health: 50, attack: 15 })],
      enemyTeam: [
        createUnit('enemy-a', { health: 10, speed: 5 }),
        createUnit('enemy-b', { health: 10, speed: 4 }),
      ],
      seed: 3,
    })

    expect(result.winner).toBe('player')
    expect(
      result.rounds
        .flatMap((round) => round.actions)
        .every(
          (action) => action.actorId === 'solo' || action.actorSide === 'enemy',
        ),
    ).toBe(true)
  })

  it('lets the fastest living monster act first', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('fast', { speed: 999, attack: 20 })],
      enemyTeam: [createUnit('slow', { health: 10, speed: 1 })],
      seed: 4,
    })

    expect(result.rounds[0]?.actions[0]?.actorId).toBe('fast')
    expect(
      result.rounds
        .flatMap((round) => round.actions)
        .some((action) => action.actorId === 'slow'),
    ).toBe(false)
  })

  it('applies a buff before the attacker acts in the next round', () => {
    const rally: CombatAbility = {
      id: 'investida-crescente',
      name: 'Investida crescente',
      power: 1,
      effect: { kind: 'buff', stat: 'attack', amount: 0.5 },
    }
    const result = simulateBattle({
      playerTeam: [createUnit('buffer', { health: 100 }, [rally])],
      enemyTeam: [createUnit('target', { health: 100, attack: 1, speed: 1 })],
      seed: 5,
    })
    const playerActions = result.rounds
      .flatMap((round) => round.actions)
      .filter((action) => action.actorId === 'buffer')

    expect(playerActions[0]?.damage).toBe(10)
    expect(playerActions[1]?.damage).toBe(15)
  })

  it('applies a debuff before damage in the next round', () => {
    const exposeArmor: CombatAbility = {
      id: 'expor-armadura',
      name: 'Expor armadura',
      power: 1,
      effect: { kind: 'debuff', stat: 'defense', amount: 0.5 },
    }
    const result = simulateBattle({
      playerTeam: [createUnit('debuffer', { health: 100 }, [exposeArmor])],
      enemyTeam: [
        createUnit('armored', {
          health: 100,
          attack: 1,
          defense: 10,
          speed: 1,
        }),
      ],
      seed: 51,
    })
    const playerActions = result.rounds
      .flatMap((round) => round.actions)
      .filter((action) => action.actorId === 'debuffer')

    expect(playerActions[0]?.damage).toBe(5)
    expect(playerActions[1]?.damage).toBe(7.5)
  })

  it('records the round and each action in the battle log', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('player', { attack: 50, speed: 20 })],
      enemyTeam: [createUnit('enemy', { health: 10 })],
      seed: 52,
    })

    expect(result.log[0]).toBe('Rodada 1')
    expect(result.log[1]).toContain('player usou Golpe básico em enemy')
  })

  it('includes configured rewards exactly once after a player victory', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('player', { attack: 50, speed: 20 })],
      enemyTeam: [createUnit('enemy', { health: 10 })],
      rewards: [{ itemId: 'fragmento-de-pedra', quantity: 2 }],
      seed: 6,
    })

    expect(result.rewards).toEqual([
      { itemId: 'fragmento-de-pedra', quantity: 2 },
    ])
    expect(result.rewards).toHaveLength(1)
  })

  it('does not grant rewards after an enemy victory', () => {
    const result = simulateBattle({
      playerTeam: [createUnit('player', { health: 5 })],
      enemyTeam: [createUnit('enemy', { attack: 50, speed: 20 })],
      rewards: [{ itemId: 'fragmento-de-pedra', quantity: 2 }],
      seed: 7,
    })

    expect(result.rewards).toBeUndefined()
  })

  it('produces exactly the same result for the same seed and input', () => {
    const heavyStrike: CombatAbility = {
      id: 'golpe-pesado',
      name: 'Golpe pesado',
      power: 1.8,
    }
    const input = {
      playerTeam: [createUnit('player', {}, [strike, heavyStrike])],
      enemyTeam: [
        createUnit('enemy-a', { speed: 10 }),
        createUnit('enemy-b', { speed: 10 }),
      ],
      seed: 12345,
    } as const

    expect(simulateBattle(input)).toEqual(simulateBattle(input))
  })

  it('returns a draw without exceeding one hundred rounds', () => {
    const result = simulateBattle({
      playerTeam: [
        createUnit('player', { health: 10_000, attack: 1, defense: 10_000 }),
      ],
      enemyTeam: [
        createUnit('enemy', { health: 10_000, attack: 1, defense: 10_000 }),
      ],
      seed: 8,
    })

    expect(result.winner).toBe('draw')
    expect(result.rounds).toHaveLength(100)
  })

  it('does not mutate the combat units received as input', () => {
    const player = createUnit('player', { health: 20 })
    const enemy = createUnit('enemy', { health: 20 })

    simulateBattle({ playerTeam: [player], enemyTeam: [enemy], seed: 9 })

    expect(player.stats.health).toBe(20)
    expect(enemy.stats.health).toBe(20)
  })
})

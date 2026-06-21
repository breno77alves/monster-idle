import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  monsterAbilitySchema,
  monsterRoleSchema,
  monsterSpeciesSchema,
  monsterTeamSchema,
  monsterTypeSchema,
  ownedMonsterSchema,
} from './monster-schemas'
import type {
  MonsterAbility,
  MonsterRole,
  MonsterSpecies,
  MonsterTeam,
  MonsterType,
  OwnedMonster,
} from './monster-types'

const validSpecies = {
  id: 'fagulume',
  name: 'Fagulume',
  description: 'Uma centelha curiosa que flutua entre pedras quentes.',
  types: ['chama'],
  role: 'damage',
  baseStats: { health: 42, attack: 15, defense: 8, speed: 13 },
  abilityIds: ['salto-de-brasa', 'rastro-cintilante'],
  passiveId: 'calor-persistente',
  portraitPath: '/monsters/placeholder.svg',
} as const

const validOwnedMonster = {
  instanceId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  speciesId: 'fagulume',
  nickname: 'Faísca',
  level: 1,
  experience: 0,
  unlockedAbilityIds: ['salto-de-brasa'],
  equippedAccessoryIds: [],
  obtainedAt: '2026-06-21T12:00:00.000Z',
} as const

const validAbility = {
  id: 'salto-de-brasa',
  name: 'Salto de Brasa',
  description: 'Avança em um arco curto e espalha calor.',
  power: 1.2,
  type: 'chama',
  unlockLevel: 1,
  effect: { kind: 'debuff', stat: 'defense', amount: 0.1 },
} as const

const validTeam = {
  id: 'time-principal',
  name: 'Equipe de Campo',
  monsterInstanceIds: [
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  ],
} as const

describe('monster type and role schemas', () => {
  it('accepts only the three MVP elemental types', () => {
    expect(monsterTypeSchema.parse('chama')).toBe('chama')
    expect(monsterTypeSchema.safeParse('eletrico').success).toBe(false)
    expectTypeOf(
      monsterTypeSchema.parse('aquatico'),
    ).toEqualTypeOf<MonsterType>()
  })

  it('accepts only tank, damage, and support roles', () => {
    expect(monsterRoleSchema.parse('support')).toBe('support')
    expect(monsterRoleSchema.safeParse('healer').success).toBe(false)
    expectTypeOf(monsterRoleSchema.parse('tank')).toEqualTypeOf<MonsterRole>()
  })
})

describe('monsterSpeciesSchema', () => {
  it('accepts a complete immutable species definition', () => {
    const parsed = monsterSpeciesSchema.parse(validSpecies)

    expect(parsed.id).toBe('fagulume')
    expectTypeOf(parsed).toEqualTypeOf<MonsterSpecies>()
  })

  it('rejects invalid IDs, stats, and ability counts', () => {
    expect(
      monsterSpeciesSchema.safeParse({ ...validSpecies, id: 'Fagulume' })
        .success,
    ).toBe(false)
    expect(
      monsterSpeciesSchema.safeParse({
        ...validSpecies,
        baseStats: { ...validSpecies.baseStats, health: 0 },
      }).success,
    ).toBe(false)
    expect(
      monsterSpeciesSchema.safeParse({
        ...validSpecies,
        abilityIds: ['uma-habilidade'],
      }).success,
    ).toBe(false)
  })
})

describe('ownedMonsterSchema', () => {
  it('keeps instance data separate from species data', () => {
    const parsed = ownedMonsterSchema.parse(validOwnedMonster)

    expect(parsed.instanceId).not.toBe(parsed.speciesId)
    expectTypeOf(parsed).toEqualTypeOf<OwnedMonster>()
  })

  it('rejects non-v4 instance IDs and non-ISO dates', () => {
    expect(
      ownedMonsterSchema.safeParse({
        ...validOwnedMonster,
        instanceId: 'fagulume',
      }).success,
    ).toBe(false)
    expect(
      ownedMonsterSchema.safeParse({
        ...validOwnedMonster,
        obtainedAt: new Date(),
      }).success,
    ).toBe(false)
  })
})

describe('monsterAbilitySchema', () => {
  it('accepts a typed optional effect', () => {
    const parsed = monsterAbilitySchema.parse(validAbility)

    expect(parsed.effect?.kind).toBe('debuff')
    expectTypeOf(parsed).toEqualTypeOf<MonsterAbility>()
  })

  it('rejects negative power and unknown stats', () => {
    expect(
      monsterAbilitySchema.safeParse({ ...validAbility, power: -1 }).success,
    ).toBe(false)
    expect(
      monsterAbilitySchema.safeParse({
        ...validAbility,
        effect: { kind: 'buff', stat: 'luck', amount: 1 },
      }).success,
    ).toBe(false)
  })
})

describe('monsterTeamSchema', () => {
  it('accepts a team with up to three unique instances', () => {
    const parsed = monsterTeamSchema.parse(validTeam)

    expect(parsed.monsterInstanceIds).toHaveLength(2)
    expectTypeOf(parsed).toEqualTypeOf<MonsterTeam>()
  })

  it('rejects duplicate instances and teams larger than three', () => {
    const duplicateId = validTeam.monsterInstanceIds[0]
    expect(
      monsterTeamSchema.safeParse({
        ...validTeam,
        monsterInstanceIds: [duplicateId, duplicateId],
      }).success,
    ).toBe(false)
    expect(
      monsterTeamSchema.safeParse({
        ...validTeam,
        monsterInstanceIds: [
          ...validTeam.monsterInstanceIds,
          'c3d4e5f6-a7b8-4c9d-8e0f-2a3b4c5d6e7f',
          'd4e5f6a7-b8c9-4d0e-9f1a-3b4c5d6e7f8a',
        ],
      }).success,
    ).toBe(false)
  })
})

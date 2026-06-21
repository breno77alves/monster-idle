import { describe, expect, it } from 'vitest'
import { monsterSpeciesSchema } from '../../domain/monster-schemas'
import { monsterSpecies } from './index'

describe('monsterSpecies', () => {
  it('contains exactly six schema-valid placeholder species', () => {
    expect(monsterSpecies).toHaveLength(6)

    for (const species of monsterSpecies) {
      expect(monsterSpeciesSchema.safeParse(species).success).toBe(true)
    }
  })

  it('uses unique species IDs and all three MVP elements', () => {
    const ids = monsterSpecies.map((species) => species.id)
    const types = monsterSpecies.flatMap((species) => species.types)

    expect(new Set(ids).size).toBe(monsterSpecies.length)
    expect(new Set(types)).toEqual(new Set(['chama', 'natureza', 'aquatico']))
  })

  it('keeps the exported catalog immutable', () => {
    expect(Object.isFrozen(monsterSpecies)).toBe(true)
  })
})

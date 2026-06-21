import { describe, expect, it } from 'vitest'
import { calculateDamage } from './damage'

describe('calculateDamage', () => {
  it('uses the single documented damage formula', () => {
    expect(calculateDamage({ attack: 10, power: 2, defense: 6 })).toBe(17)
  })

  it('deals full damage against zero defense', () => {
    expect(calculateDamage({ attack: 10, power: 2, defense: 0 })).toBe(20)
  })

  it('always deals at least one damage', () => {
    expect(calculateDamage({ attack: 1, power: 0, defense: 999 })).toBe(1)
  })
})

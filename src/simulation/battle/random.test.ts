import { describe, expect, it } from 'vitest'
import { createSeededRandom } from './random'

describe('createSeededRandom', () => {
  it('repeats the same sequence for the same seed', () => {
    const first = createSeededRandom(42)
    const second = createSeededRandom(42)

    expect([first.next(), first.next(), first.next()]).toEqual([
      second.next(),
      second.next(),
      second.next(),
    ])
  })

  it('keeps integer selections inside the requested range', () => {
    const random = createSeededRandom(7)
    const selections = Array.from({ length: 20 }, () => random.nextInt(3))

    expect(selections.every((value) => value >= 0 && value < 3)).toBe(true)
  })
})

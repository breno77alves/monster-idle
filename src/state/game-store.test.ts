import { describe, expect, it } from 'vitest'
import { useGameStore } from './game-store'

describe('useGameStore', () => {
  it('starts empty before gameplay state is introduced', () => {
    expect(useGameStore.getState()).toEqual({})
  })
})

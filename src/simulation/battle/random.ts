export interface SeededRandom {
  next(): number
  nextInt(maxExclusive: number): number
}

const UINT32_RANGE = 0x1_0000_0000
const MULTIPLIER = 1_664_525
const INCREMENT = 1_013_904_223

export function createSeededRandom(seed: number): SeededRandom {
  let state = seed >>> 0

  const next = () => {
    state = (Math.imul(state, MULTIPLIER) + INCREMENT) >>> 0
    return state / UINT32_RANGE
  }

  return {
    next,
    nextInt(maxExclusive) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new RangeError('maxExclusive deve ser um inteiro positivo.')
      }

      return Math.floor(next() * maxExclusive)
    },
  }
}

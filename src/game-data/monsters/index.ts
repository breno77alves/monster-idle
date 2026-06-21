import type { MonsterSpecies } from '../../domain/monster-types'
import { brotolim } from './brotolim'
import { cascomar } from './cascomar'
import { espinhal } from './espinhal'
import { fagulume } from './fagulume'
import { fornalho } from './fornalho'
import { marulhino } from './marulhino'

export const monsterSpecies: readonly MonsterSpecies[] = Object.freeze([
  fagulume,
  fornalho,
  brotolim,
  espinhal,
  marulhino,
  cascomar,
])

export { brotolim, cascomar, espinhal, fagulume, fornalho, marulhino }

export type MonsterType = 'chama' | 'natureza' | 'aquatico'

export type MonsterRole = 'tank' | 'damage' | 'support'

export interface MonsterStats {
  readonly health: number
  readonly attack: number
  readonly defense: number
  readonly speed: number
}

export interface MonsterSpecies {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly types: readonly MonsterType[]
  readonly role: MonsterRole
  readonly baseStats: MonsterStats
  readonly abilityIds: readonly string[]
  readonly passiveId?: string
  readonly portraitPath: string
}

export interface OwnedMonster {
  readonly instanceId: string
  readonly speciesId: string
  readonly nickname?: string
  readonly level: number
  readonly experience: number
  readonly unlockedAbilityIds: readonly string[]
  readonly equippedAccessoryIds: readonly string[]
  readonly obtainedAt: string
}

export interface MonsterTeam {
  readonly id: string
  readonly name: string
  readonly monsterInstanceIds: readonly string[]
}

export type AbilityEffect =
  | {
      readonly kind: 'buff' | 'debuff'
      readonly stat: keyof MonsterStats
      readonly amount: number
    }
  | {
      readonly kind: 'heal'
      readonly amount: number
    }

export interface MonsterAbility {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly power: number
  readonly type: MonsterType
  readonly unlockLevel: number
  readonly effect?: AbilityEffect
}

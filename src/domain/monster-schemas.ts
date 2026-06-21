import { z } from 'zod'
import type {
  AbilityEffect,
  MonsterAbility,
  MonsterRole,
  MonsterSpecies,
  MonsterStats,
  MonsterTeam,
  MonsterType,
  OwnedMonster,
} from './monster-types'

const kebabCaseIdSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

const uniqueValues = <Value>(values: readonly Value[]) =>
  new Set(values).size === values.length

export const monsterTypeSchema: z.ZodType<MonsterType> = z.enum([
  'chama',
  'natureza',
  'aquatico',
])

export const monsterRoleSchema: z.ZodType<MonsterRole> = z.enum([
  'tank',
  'damage',
  'support',
])

export const monsterStatsSchema: z.ZodType<MonsterStats> = z
  .object({
    health: z.number().int().positive(),
    attack: z.number().int().positive(),
    defense: z.number().int().positive(),
    speed: z.number().int().positive(),
  })
  .strict()

export const monsterSpeciesSchema: z.ZodType<MonsterSpecies> = z
  .object({
    id: kebabCaseIdSchema,
    name: z.string().trim().min(1).max(48),
    description: z.string().trim().min(1).max(240),
    types: z
      .array(monsterTypeSchema)
      .min(1)
      .max(2)
      .refine(uniqueValues, 'Os tipos da espécie devem ser únicos.'),
    role: monsterRoleSchema,
    baseStats: monsterStatsSchema,
    abilityIds: z
      .array(kebabCaseIdSchema)
      .length(2)
      .refine(uniqueValues, 'As habilidades da espécie devem ser únicas.'),
    passiveId: kebabCaseIdSchema.optional(),
    portraitPath: z.string().trim().startsWith('/').min(2),
  })
  .strict()

export const ownedMonsterSchema: z.ZodType<OwnedMonster> = z
  .object({
    instanceId: z.uuidv4(),
    speciesId: kebabCaseIdSchema,
    nickname: z.string().trim().min(1).max(32).optional(),
    level: z.number().int().positive(),
    experience: z.number().int().nonnegative(),
    unlockedAbilityIds: z
      .array(kebabCaseIdSchema)
      .refine(uniqueValues, 'As habilidades desbloqueadas devem ser únicas.'),
    equippedAccessoryIds: z
      .array(kebabCaseIdSchema)
      .refine(uniqueValues, 'Os acessórios equipados devem ser únicos.'),
    obtainedAt: z.iso.datetime({ offset: true }),
  })
  .strict()

const statEffectSchema = z
  .object({
    kind: z.enum(['buff', 'debuff']),
    stat: z.enum(['health', 'attack', 'defense', 'speed']),
    amount: z.number().finite().positive(),
  })
  .strict()

const healEffectSchema = z
  .object({
    kind: z.literal('heal'),
    amount: z.number().finite().positive(),
  })
  .strict()

export const abilityEffectSchema: z.ZodType<AbilityEffect> =
  z.discriminatedUnion('kind', [statEffectSchema, healEffectSchema])

export const monsterAbilitySchema: z.ZodType<MonsterAbility> = z
  .object({
    id: kebabCaseIdSchema,
    name: z.string().trim().min(1).max(64),
    description: z.string().trim().min(1).max(240),
    power: z.number().finite().nonnegative(),
    type: monsterTypeSchema,
    unlockLevel: z.number().int().positive(),
    effect: abilityEffectSchema.optional(),
  })
  .strict()

export const monsterTeamSchema: z.ZodType<MonsterTeam> = z
  .object({
    id: kebabCaseIdSchema,
    name: z.string().trim().min(1).max(48),
    monsterInstanceIds: z
      .array(z.uuidv4())
      .max(3)
      .refine(uniqueValues, 'As instâncias do time devem ser únicas.'),
  })
  .strict()

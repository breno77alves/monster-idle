interface DamageInput {
  readonly attack: number
  readonly power: number
  readonly defense: number
}

export function calculateDamage({ attack, power, defense }: DamageInput) {
  const safeAttack = Number.isFinite(attack) ? Math.max(0, attack) : 0
  const safePower = Number.isFinite(power) ? Math.max(0, power) : 0
  const safeDefense = Number.isFinite(defense) ? Math.max(0, defense) : 0

  return Math.max(1, safeAttack * safePower - safeDefense * 0.5)
}

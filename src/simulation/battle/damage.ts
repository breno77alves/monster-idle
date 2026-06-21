interface DamageInput {
  readonly attack: number
  readonly power: number
  readonly defense: number
}

export function calculateDamage({ attack, power, defense }: DamageInput) {
  return Math.max(1, attack * power - defense * 0.5)
}

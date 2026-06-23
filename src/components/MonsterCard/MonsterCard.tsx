import type {
  MonsterRole,
  MonsterSpecies,
  MonsterStats,
  MonsterType,
} from '../../domain/monster-types'
import { MonsterPortrait } from '../MonsterPortrait/MonsterPortrait'

interface MonsterCardProps {
  readonly species: MonsterSpecies
  readonly catalogNumber: number
}

const typeLabels: Record<MonsterType, string> = {
  chama: 'Chama',
  natureza: 'Natureza',
  aquatico: 'Aquático',
}

const roleLabels: Record<MonsterRole, string> = {
  tank: 'Guardião',
  damage: 'Ataque',
  support: 'Suporte',
}

const stats: ReadonlyArray<readonly [keyof MonsterStats, string]> = [
  ['health', 'Vida'],
  ['attack', 'Ataque'],
  ['defense', 'Defesa'],
  ['speed', 'Velocidade'],
]

export function MonsterCard({ species, catalogNumber }: MonsterCardProps) {
  const primaryType = species.types[0]

  return (
    <article
      className={`monster-card monster-card--${primaryType}`}
      aria-label={species.name}
    >
      <div className="monster-portrait">
        <span className="catalog-number">
          #{catalogNumber.toString().padStart(2, '0')}
        </span>
        <MonsterPortrait
          species={species}
          alt={`Retrato provisório de ${species.name}`}
        />
      </div>

      <div className="monster-card-body">
        <div className="monster-tags" aria-label="Classificação">
          <span className="monster-type">{typeLabels[primaryType]}</span>
          <span className="monster-role">{roleLabels[species.role]}</span>
        </div>

        <h2>{species.name}</h2>
        <p>{species.description}</p>

        <dl className="monster-stats">
          {stats.map(([stat, label]) => (
            <div key={stat}>
              <dt>{label}</dt>
              <dd>{species.baseStats[stat]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

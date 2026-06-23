import { MonsterPortrait } from '../../components/MonsterPortrait/MonsterPortrait'
import type { MonsterSpecies } from '../../domain/monster-types'
import type { BattleUnitPresentation } from './battle-presentation'

interface BattleUnitCardProps {
  readonly unit: BattleUnitPresentation
  readonly species: MonsterSpecies | undefined
  readonly currentHealth: number
  readonly isActing: boolean
  readonly isTargeted: boolean
}

export function BattleUnitCard({
  unit,
  species,
  currentHealth,
  isActing,
  isTargeted,
}: BattleUnitCardProps) {
  const safeHealth = Math.max(0, Math.min(currentHealth, unit.maxHealth))

  return (
    <article
      className={`battle-unit${isActing ? ' battle-unit--acting' : ''}${isTargeted ? ' battle-unit--targeted' : ''}${safeHealth <= 0 ? ' battle-unit--defeated' : ''}`}
      aria-label={unit.name}
    >
      <div className="battle-unit-portrait">
        {species ? (
          <MonsterPortrait
            species={species}
            alt={`Retrato provisório de ${unit.name}`}
          />
        ) : (
          <span aria-hidden="true">?</span>
        )}
      </div>

      <div className="battle-unit-info">
        <div className="battle-unit-title">
          <h3>{unit.name}</h3>
          <span>{safeHealth <= 0 ? 'Derrotado' : 'NV 1'}</span>
        </div>
        <progress
          className="health-track"
          aria-label={`Vida de ${unit.name}`}
          max={unit.maxHealth}
          value={safeHealth}
        >
          {safeHealth} de {unit.maxHealth}
        </progress>
        <small>
          {Math.ceil(safeHealth)} / {unit.maxHealth} HP
        </small>
      </div>
    </article>
  )
}

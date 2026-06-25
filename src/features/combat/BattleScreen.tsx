import { useEffect, useState } from 'react'
import { demoBattleInput } from '../../game-data/demo-battle'
import { monsterSpecies } from '../../game-data/monsters'
import { createBattlePresentation } from './battle-presentation'
import {
  BattleLogPanel,
  BattleProgressNote,
  BattleResultPanel,
} from './BattlePanels'
import { BattleUnitCard } from './BattleUnitCard'

const presentation = createBattlePresentation(demoBattleInput)
const speciesById = new Map(
  monsterSpecies.map((species) => [species.id, species]),
)
const unitsById = new Map(presentation.units.map((unit) => [unit.id, unit]))
const LAST_FRAME_INDEX = presentation.frames.length - 1

type PlaybackSpeed = 1 | 2

export function BattleScreen() {
  const [frameIndex, setFrameIndex] = useState(0)
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const frame = presentation.frames[frameIndex] ?? presentation.frames[0]

  useEffect(() => {
    if (!frame || frame.isComplete) return

    const timer = window.setTimeout(() => {
      setFrameIndex((current) => Math.min(current + 1, LAST_FRAME_INDEX))
    }, 1_100 / speed)

    return () => window.clearTimeout(timer)
  }, [frame, speed])

  if (!frame) return null

  const playerUnits = presentation.units.filter(
    (unit) => unit.side === 'player',
  )
  const enemyUnits = presentation.units.filter((unit) => unit.side === 'enemy')
  const actingUnit = frame.currentAction
    ? unitsById.get(frame.currentAction.actorId)
    : undefined
  const targetUnit = frame.currentAction
    ? unitsById.get(frame.currentAction.targetId)
    : undefined
  const actionLine = frame.currentAction
    ? frame.visibleLog.at(-1)
    : 'Os dois times se preparam para o confronto.'

  const renderUnit = (unit: (typeof presentation.units)[number]) => (
    <BattleUnitCard
      key={unit.id}
      unit={unit}
      species={speciesById.get(unit.id)}
      currentHealth={frame.healthByUnitId[unit.id] ?? 0}
      isActing={frame.currentAction?.actorId === unit.id}
      isTargeted={frame.currentAction?.targetId === unit.id}
    />
  )

  return (
    <section className="battle-screen" aria-labelledby="battle-title">
      <header className="battle-header">
        <div>
          <p className="eyebrow">Simulação determinística · bosque baixo</p>
          <h1 id="battle-title">Confronto no Bosque Baixo</h1>
          <p>
            Acompanhe cada ação do motor automático ou avance diretamente para o
            resultado.
          </p>
        </div>
        <div className="battle-seed">
          <span>Seed</span>
          <strong>{demoBattleInput.seed}</strong>
        </div>
      </header>

      <div className="battle-toolbar" aria-label="Controles da batalha">
        <div>
          <span>Velocidade</span>
          <button
            type="button"
            aria-label="Velocidade 1×"
            aria-pressed={speed === 1}
            onClick={() => setSpeed(1)}
          >
            1×
          </button>
          <button
            type="button"
            aria-label="Velocidade 2×"
            aria-pressed={speed === 2}
            onClick={() => setSpeed(2)}
          >
            2×
          </button>
        </div>
        <button
          className="skip-battle"
          type="button"
          aria-label="Pular batalha"
          onClick={() => setFrameIndex(LAST_FRAME_INDEX)}
        >
          Pular batalha
        </button>
      </div>

      <div className="battle-stage">
        <section className="battle-team battle-team--player">
          <div className="battle-team-heading">
            <span>01</span>
            <div>
              <p>Treinador</p>
              <h2>Seu time</h2>
            </div>
          </div>
          <div className="battle-roster">{playerUnits.map(renderUnit)}</div>
        </section>

        <div className="battle-action" aria-live="polite">
          <span className="round-label">
            {frame.isComplete
              ? 'Encerrado'
              : `Rodada ${Math.max(1, frame.roundNumber)}`}
          </span>
          <strong>
            {frame.isComplete ? 'Fim do confronto' : 'Ação atual'}
          </strong>
          <p>{actionLine}</p>
          {actingUnit && targetUnit ? (
            <small>
              {actingUnit.name} → {targetUnit.name}
            </small>
          ) : null}
        </div>

        <section className="battle-team battle-team--enemy">
          <div className="battle-team-heading">
            <span>02</span>
            <div>
              <p>Encontro</p>
              <h2>Criaturas selvagens</h2>
            </div>
          </div>
          <div className="battle-roster">{enemyUnits.map(renderUnit)}</div>
        </section>
      </div>

      <div className="battle-lower-grid">
        <BattleLogPanel entries={frame.visibleLog} frameIndex={frameIndex} />

        {frame.isComplete ? (
          <BattleResultPanel
            result={presentation.result}
            roundNumber={frame.roundNumber}
            onReplay={() => setFrameIndex(0)}
          />
        ) : (
          <BattleProgressNote current={frameIndex} total={LAST_FRAME_INDEX} />
        )}
      </div>
    </section>
  )
}

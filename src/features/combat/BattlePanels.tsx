import type { BattleResult } from '../../simulation/battle'

interface BattleLogPanelProps {
  readonly entries: readonly string[]
  readonly frameIndex: number
}

interface BattleResultPanelProps {
  readonly result: BattleResult
  readonly roundNumber: number
  readonly onReplay: () => void
}

interface BattleProgressNoteProps {
  readonly current: number
  readonly total: number
}

const rewardLabels: Readonly<Record<string, string>> = {
  'fragmento-de-pedra': 'Fragmento de pedra',
}

export function BattleLogPanel({ entries, frameIndex }: BattleLogPanelProps) {
  return (
    <section className="battle-log" aria-labelledby="battle-log-title">
      <header>
        <div>
          <p className="panel-kicker">Registro automático</p>
          <h2 id="battle-log-title">Battle log</h2>
        </div>
        <span>{entries.length} eventos</span>
      </header>
      {entries.length > 0 ? (
        <ol>
          {entries.slice(-6).map((entry, index) => (
            <li key={`${frameIndex}-${index}`}>{entry}</li>
          ))}
        </ol>
      ) : (
        <p className="battle-log-empty">Aguardando a primeira ação.</p>
      )}
    </section>
  )
}

export function BattleResultPanel({
  result,
  roundNumber,
  onReplay,
}: BattleResultPanelProps) {
  const title =
    result.winner === 'player'
      ? 'Vitória do treinador'
      : result.winner === 'enemy'
        ? 'Derrota do treinador'
        : 'Empate'

  return (
    <section className="battle-result" role="status">
      <p className="panel-kicker">Resultado confirmado</p>
      <h2>{title}</h2>
      <p>O motor encerrou a batalha em {roundNumber} rodadas.</p>
      {result.rewards ? (
        <div className="battle-rewards">
          <h2>Recompensas</h2>
          <ul>
            {result.rewards.map((reward) => (
              <li key={reward.itemId}>
                {rewardLabels[reward.itemId] ?? reward.itemId} ×
                {reward.quantity}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button type="button" onClick={onReplay}>
        Rever batalha
      </button>
    </section>
  )
}

export function BattleProgressNote({
  current,
  total,
}: BattleProgressNoteProps) {
  return (
    <aside className="battle-progress-note">
      <span>{current}</span>
      <div>
        <strong>Ações processadas</strong>
        <small>de {total} ações determinísticas</small>
      </div>
    </aside>
  )
}

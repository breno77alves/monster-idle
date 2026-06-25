import { MonsterPortrait } from '../../components/MonsterPortrait/MonsterPortrait'
import { monsterSpecies } from '../../game-data/monsters'

export function HomeScreen() {
  const companion = monsterSpecies[0]

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <header className="dashboard-intro">
        <div>
          <p className="eyebrow">Dia 01 · posto avançado</p>
          <h1 id="dashboard-title">Seu novo caderno de campo</h1>
          <p>
            Organize a rotina, acompanhe seu time e prepare a primeira jornada.
            Os sistemas abaixo mostram a direção do loop idle.
          </p>
        </div>
        <div className="rank-seal" aria-label="Nível atual do treinador">
          <span>NV</span>
          <strong>01</strong>
          <small>Recruta</small>
        </div>
      </header>

      <div className="dashboard-grid">
        <article className="dashboard-panel activity-panel">
          <header className="panel-heading">
            <div>
              <p className="panel-kicker">Atividade atual</p>
              <h2>Coleta de campo</h2>
            </div>
            <span className="status-chip status-chip--idle">Aguardando</span>
          </header>
          <p className="panel-copy">
            Designe uma criatura para recolher fibras, sementes e pequenos
            fragmentos nos arredores do acampamento.
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progresso da coleta"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={0}
          >
            <span />
          </div>
          <dl className="panel-metrics">
            <div>
              <dt>Duração</dt>
              <dd>00:30</dd>
            </div>
            <div>
              <dt>Rendimento</dt>
              <dd>+3 itens</dd>
            </div>
            <div>
              <dt>Bônus do time</dt>
              <dd>+0%</dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-panel expedition-panel">
          <header className="panel-heading">
            <div>
              <p className="panel-kicker">Mapa de jornada</p>
              <h2>Primeira expedição</h2>
            </div>
            <span className="status-chip">Bloqueada</span>
          </header>
          <div className="route-preview" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="panel-copy">
            Monte um time para reconhecer a trilha além do bosque baixo.
          </p>
          <div className="requirement-line">
            <span>Requisito</span>
            <strong>Time com 1 criatura</strong>
          </div>
          <a className="panel-action" href="/battle/demo">
            Testar confronto <span aria-hidden="true">→</span>
          </a>
        </article>

        <article className="dashboard-panel companion-panel">
          <div className="companion-copy">
            <p className="panel-kicker">Primeiro registro</p>
            <h2>Companhia de campo</h2>
            <p className="panel-copy">
              Fagulume está pronto para ocupar o primeiro espaço do seu time.
            </p>
            <dl className="companion-stats">
              <div>
                <dt>Tipo</dt>
                <dd>Chama</dd>
              </div>
              <div>
                <dt>Função</dt>
                <dd>Ataque</dd>
              </div>
            </dl>
          </div>
          {companion ? (
            <div className="companion-art">
              <MonsterPortrait
                species={companion}
                alt="Retrato provisório de Fagulume"
              />
            </div>
          ) : null}
        </article>

        <article className="dashboard-panel incubator-panel">
          <header className="panel-heading">
            <div>
              <p className="panel-kicker">Laboratório</p>
              <h2>Incubadora</h2>
            </div>
            <span className="status-chip">0 / 1</span>
          </header>
          <div className="empty-incubator" aria-hidden="true">
            <span className="egg-outline" />
            <span className="incubator-pulse" />
          </div>
          <p className="panel-copy">
            O primeiro ovo encontrado durante uma jornada aparecerá aqui.
          </p>
        </article>
      </div>
    </section>
  )
}

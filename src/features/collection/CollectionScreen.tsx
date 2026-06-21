import { MonsterCard } from '../../components/MonsterCard/MonsterCard'
import { monsterSpecies } from '../../game-data/monsters'

export function CollectionScreen() {
  return (
    <section className="collection-page" aria-labelledby="collection-title">
      <header className="collection-intro">
        <div>
          <p className="eyebrow">Arquivo de espécies · protótipo</p>
          <h1 id="collection-title">Coleção</h1>
          <p className="page-description">
            Primeiros registros do nosso ecossistema. Nomes, atributos e
            retratos ainda são material de estudo e vão evoluir com o jogo.
          </p>
        </div>

        <div className="catalog-summary" aria-label="Resumo do catálogo">
          <strong>{monsterSpecies.length}</strong>
          <span>espécies catalogadas</span>
          <small>3 elementos · 3 funções</small>
        </div>
      </header>

      <div className="species-grid">
        {monsterSpecies.map((species, index) => (
          <MonsterCard
            key={species.id}
            species={species}
            catalogNumber={index + 1}
          />
        ))}
      </div>
    </section>
  )
}

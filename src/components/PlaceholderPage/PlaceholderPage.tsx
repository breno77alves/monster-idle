interface PlaceholderCard {
  title: string
  description: string
  marker: string
}

interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  cards: readonly PlaceholderCard[]
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  cards,
}: PlaceholderPageProps) {
  return (
    <section className="placeholder-page" aria-labelledby="page-title">
      <header className="page-intro">
        <div className="page-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <div className="field-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>

      <div className="placeholder-grid">
        {cards.map((card) => (
          <article className="placeholder-card" key={card.title}>
            <span className="card-marker" aria-hidden="true">
              {card.marker}
            </span>
            <div>
              <p className="card-status">Em preparação</p>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function ExpeditionsScreen() {
  return (
    <PlaceholderPage
      eyebrow="Mapa de jornadas"
      title="Expedições"
      description="Escolha um destino, conheça os riscos e envie seu time para uma sequência de encontros automáticos."
      cards={[
        {
          marker: 'N',
          title: 'Primeira região',
          description: 'O mapa inicial será revelado neste espaço.',
        },
        {
          marker: '!',
          title: 'Encontros',
          description:
            'Inimigos e dificuldade serão apresentados antes da partida.',
        },
        {
          marker: '★',
          title: 'Recompensas',
          description: 'Materiais e chances de ovo serão listados aqui.',
        },
      ]}
    />
  )
}

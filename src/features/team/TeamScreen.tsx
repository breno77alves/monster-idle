import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function TeamScreen() {
  return (
    <PlaceholderPage
      eyebrow="Formação de expedição"
      title="Seu time"
      description="Três posições, funções complementares e escolhas que conectam combate às atividades do acampamento."
      cards={[
        {
          marker: 'I',
          title: 'Primeira posição',
          description: 'Um monstro poderá ocupar este espaço.',
        },
        {
          marker: 'II',
          title: 'Segunda posição',
          description: 'Combine tipos e funções para criar sinergia.',
        },
        {
          marker: 'III',
          title: 'Terceira posição',
          description: 'Complete a formação antes de partir.',
        },
      ]}
    />
  )
}

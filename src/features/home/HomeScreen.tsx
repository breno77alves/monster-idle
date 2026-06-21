import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function HomeScreen() {
  return (
    <PlaceholderPage
      eyebrow="Caderno de campo · página 01"
      title="Seu novo caderno de campo"
      description="O acampamento está sendo montado. Este será o ponto de partida para acompanhar suas descobertas, trabalhos e jornadas."
      cards={[
        {
          marker: '01',
          title: 'Atividade atual',
          description: 'O resumo da produção idle aparecerá aqui.',
        },
        {
          marker: '02',
          title: 'Expedição ativa',
          description: 'Acompanhe o time quando as jornadas forem liberadas.',
        },
        {
          marker: '03',
          title: 'Incubadora',
          description: 'O progresso dos ovos ficará visível neste espaço.',
        },
      ]}
    />
  )
}

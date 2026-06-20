import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function ActivitiesScreen() {
  return (
    <PlaceholderPage
      eyebrow="Trabalhos do acampamento"
      title="Atividades"
      description="Aqui seus monstros transformarão tempo em recursos, mesmo enquanto você estiver longe."
      cards={[
        {
          marker: '01',
          title: 'Coleta',
          description: 'A primeira atividade idle será preparada neste painel.',
        },
        {
          marker: '+',
          title: 'Bônus elementais',
          description: 'Tipos compatíveis ajudarão na produção.',
        },
        {
          marker: '8H',
          title: 'Progresso offline',
          description: 'O retorno mostrará um resumo claro dos ganhos.',
        },
      ]}
    />
  )
}

import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function EggsScreen() {
  return (
    <PlaceholderPage
      eyebrow="Estação de cuidados"
      title="Incubadora"
      description="Ovos encontrados em jornadas serão cuidados aqui até a chegada de um novo companheiro."
      cards={[
        {
          marker: '01',
          title: 'Primeiro berço',
          description: 'Um ovo em incubação aparecerá neste espaço.',
        },
        {
          marker: '◌',
          title: 'Tempo restante',
          description:
            'O progresso será informado sem exigir atenção constante.',
        },
        {
          marker: '↺',
          title: 'Histórico',
          description: 'Novos nascimentos formarão um registro de descobertas.',
        },
      ]}
    />
  )
}

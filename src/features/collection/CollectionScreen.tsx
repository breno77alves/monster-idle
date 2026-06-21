import { PlaceholderPage } from '../../components/PlaceholderPage/PlaceholderPage'

export function CollectionScreen() {
  return (
    <PlaceholderPage
      eyebrow="Arquivo de espécies"
      title="Coleção"
      description="Um catálogo vivo para reconhecer cada espécie encontrada e consultar suas características."
      cards={[
        {
          marker: 'A',
          title: 'Espécies descobertas',
          description: 'Retratos e registros ocuparão esta área.',
        },
        {
          marker: 'B',
          title: 'Filtros de campo',
          description: 'Organize descobertas por tipo e função.',
        },
        {
          marker: 'C',
          title: 'Ficha individual',
          description: 'Nível e habilidades serão detalhados mais adiante.',
        },
      ]}
    />
  )
}

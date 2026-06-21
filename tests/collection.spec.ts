import { expect, test } from '@playwright/test'

const speciesNames = [
  'Fagulume',
  'Fornalho',
  'Brotolim',
  'Espinhal',
  'Marulhino',
  'Cascomar',
] as const

test('presents the six initial species as an accessible catalog', async ({
  page,
}) => {
  await page.goto('/collection')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Coleção' }),
  ).toBeVisible()
  const catalogSummary = page.getByLabel('Resumo do catálogo')
  await expect(catalogSummary).toContainText('6')
  await expect(catalogSummary).toContainText('espécies catalogadas')

  for (const speciesName of speciesNames) {
    const card = page.getByRole('article', { name: speciesName })

    await expect(card).toBeVisible()
    await expect(
      card.getByRole('img', { name: `Retrato provisório de ${speciesName}` }),
    ).toBeVisible()
  }
})

import { expect, test } from '@playwright/test'

test('presents the idle game dashboard hierarchy', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('Recursos do treinador')).toBeVisible()
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Seu novo caderno de campo',
    }),
  ).toBeVisible()

  for (const panelTitle of [
    'Coleta de campo',
    'Primeira expedição',
    'Incubadora',
    'Companhia de campo',
  ]) {
    await expect(
      page.getByRole('heading', { level: 2, name: panelTitle }),
    ).toBeVisible()
  }
})

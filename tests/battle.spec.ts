import { expect, test } from '@playwright/test'

test('plays a complete battle from start to result', async ({ page }) => {
  await page.goto('/battle/demo')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Confronto no Bosque Baixo' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Seu time' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Criaturas selvagens' }),
  ).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveCount(6)

  const doubleSpeed = page.getByRole('button', { name: 'Velocidade 2×' })
  await doubleSpeed.click()
  await expect(doubleSpeed).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Pular batalha' }).click()

  await expect(page.getByRole('status')).toContainText('Vitória')
  await expect(
    page.getByRole('heading', { level: 2, name: 'Recompensas' }),
  ).toBeVisible()
  await expect(page.getByText('Fragmento de pedra ×2')).toBeVisible()
})

import { expect, test } from '@playwright/test'

const destinations = [
  { label: 'Início', path: '/', heading: 'Seu novo caderno de campo' },
  { label: 'Coleção', path: '/collection', heading: 'Coleção' },
  { label: 'Time', path: '/team', heading: 'Seu time' },
  { label: 'Atividades', path: '/activities', heading: 'Atividades' },
  { label: 'Expedições', path: '/expeditions', heading: 'Expedições' },
  { label: 'Ovos', path: '/eggs', heading: 'Incubadora' },
] as const

test('navigates through every primary screen', async ({ page }) => {
  await page.goto('/')

  for (const destination of destinations) {
    await page
      .getByRole('link', { name: destination.label, exact: true })
      .click()
    await expect(page).toHaveURL(
      new RegExp(`${destination.path.replace('/', '\\/')}$`),
    )
    await expect(
      page.getByRole('heading', { level: 1, name: destination.heading }),
    ).toBeVisible()
  }
})

test('supports direct navigation and browser history', async ({ page }) => {
  await page.goto('/team')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Seu time' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Ovos', exact: true }).click()
  await page.goBack()

  await expect(page).toHaveURL(/\/team$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Seu time' }),
  ).toBeVisible()
})

test('keeps primary navigation keyboard focusable', async ({ page }) => {
  await page.goto('/')

  const homeLink = page.getByRole('link', { name: 'Início', exact: true })
  const collectionLink = page.getByRole('link', {
    name: 'Coleção',
    exact: true,
  })

  await homeLink.focus()
  await expect(homeLink).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(collectionLink).toBeFocused()
})

import { describe, expect, it } from 'vitest'
import { appRoutes, battleRoute, resolveRoute } from './routes'

describe('appRoutes', () => {
  it('defines the six primary destinations in navigation order', () => {
    expect(appRoutes.map(({ path, label }) => ({ path, label }))).toEqual([
      { path: '/', label: 'Início' },
      { path: '/collection', label: 'Coleção' },
      { path: '/team', label: 'Time' },
      { path: '/activities', label: 'Atividades' },
      { path: '/expeditions', label: 'Expedições' },
      { path: '/eggs', label: 'Ovos' },
    ])
  })

  it('resolves an unknown path to the home route', () => {
    expect(resolveRoute('/lugar-inexistente').path).toBe('/')
  })

  it('resolves the battle demo outside primary navigation', () => {
    expect(resolveRoute('/battle/demo')).toBe(battleRoute)
    expect(appRoutes).not.toContain(battleRoute)
  })
})

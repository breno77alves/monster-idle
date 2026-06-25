export const appRoutes = [
  { path: '/', label: 'Início', icon: 'home' },
  { path: '/collection', label: 'Coleção', icon: 'collection' },
  { path: '/team', label: 'Time', icon: 'team' },
  { path: '/activities', label: 'Atividades', icon: 'activities' },
  { path: '/expeditions', label: 'Expedições', icon: 'expeditions' },
  { path: '/eggs', label: 'Ovos', icon: 'eggs' },
] as const

export const battleRoute = {
  path: '/battle/demo',
  label: 'Batalha',
  icon: 'expeditions',
} as const

export type AppRoute = (typeof appRoutes)[number]
export type AppRoutePath = AppRoute['path'] | typeof battleRoute.path
export type AppRouteIcon = AppRoute['icon']

export function resolveRoute(pathname: string): AppRoute | typeof battleRoute {
  if (pathname === battleRoute.path) return battleRoute
  return appRoutes.find((route) => route.path === pathname) ?? appRoutes[0]
}

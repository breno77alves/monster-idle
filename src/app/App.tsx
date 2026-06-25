import type { ComponentType, MouseEvent } from 'react'
import { AppIcon } from '../components/AppIcon/AppIcon'
import { ActivitiesScreen } from '../features/activities/ActivitiesScreen'
import { CollectionScreen } from '../features/collection/CollectionScreen'
import { BattleScreen } from '../features/combat/BattleScreen'
import { EggsScreen } from '../features/eggs/EggsScreen'
import { ExpeditionsScreen } from '../features/expeditions/ExpeditionsScreen'
import { HomeScreen } from '../features/home/HomeScreen'
import { TeamScreen } from '../features/team/TeamScreen'
import { appRoutes, resolveRoute } from './routes'
import type { AppRoutePath } from './routes'
import { navigate, useBrowserPathname } from './use-browser-route'
import './App.css'

const screens: Record<AppRoutePath, ComponentType> = {
  '/': HomeScreen,
  '/collection': CollectionScreen,
  '/team': TeamScreen,
  '/activities': ActivitiesScreen,
  '/expeditions': ExpeditionsScreen,
  '/eggs': EggsScreen,
  '/battle/demo': BattleScreen,
}

interface NavigationLinkProps {
  active: boolean
  route: (typeof appRoutes)[number]
}

function followInternalLink(
  event: MouseEvent<HTMLAnchorElement>,
  to: AppRoutePath,
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  event.preventDefault()
  navigate(to)
}

function NavigationLink({ active, route }: NavigationLinkProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className="nav-link"
      href={route.path}
      onClick={(event) => followInternalLink(event, route.path)}
    >
      <AppIcon name={route.icon} />
      <span>{route.label}</span>
    </a>
  )
}

export function App() {
  const currentRoute = resolveRoute(useBrowserPathname())
  const Screen = screens[currentRoute.path]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="/"
          onClick={(event) => followInternalLink(event, '/')}
        >
          <span className="brand-mark" aria-hidden="true">
            MI
          </span>
          <span>
            <strong>Monster Idle</strong>
            <small>Caderno de campo</small>
          </span>
        </a>

        <nav aria-label="Navegação principal" className="primary-nav">
          {appRoutes.map((route) => (
            <NavigationLink
              active={route.path === currentRoute.path}
              key={route.path}
              route={route}
            />
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="status-dot" aria-hidden="true" />
          <span>
            <strong>Arena em teste</strong>
            <small>Milestone 4 · protótipo local</small>
          </span>
        </div>
      </aside>

      <main className="main-column">
        <header className="topbar">
          <div className="topbar-location">
            <span className="mobile-brand">Monster Idle</span>
            <p>
              <span aria-hidden="true">⌁</span> Acampamento base
            </p>
          </div>

          <ul className="resource-strip" aria-label="Recursos do treinador">
            <li>
              <span className="resource-glyph" aria-hidden="true">
                ◈
              </span>
              <span>
                <small>Moedas</small>
                <strong>0</strong>
              </span>
            </li>
            <li>
              <span className="resource-glyph" aria-hidden="true">
                ◆
              </span>
              <span>
                <small>Fragmentos</small>
                <strong>0</strong>
              </span>
            </li>
            <li className="trainer-level">
              <small>Treinador</small>
              <strong>NV 1</strong>
            </li>
          </ul>
        </header>
        <div className="page-container">
          <Screen />
        </div>
      </main>
    </div>
  )
}

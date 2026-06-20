import { useSyncExternalStore } from 'react'
import type { AppRoutePath } from './routes'

function subscribeToLocation(onStoreChange: () => void): () => void {
  window.addEventListener('popstate', onStoreChange)
  return () => window.removeEventListener('popstate', onStoreChange)
}

function getPathname(): string {
  return window.location.pathname
}

export function useBrowserPathname(): string {
  return useSyncExternalStore(subscribeToLocation, getPathname, () => '/')
}

export function navigate(to: AppRoutePath): void {
  if (window.location.pathname === to) {
    return
  }

  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

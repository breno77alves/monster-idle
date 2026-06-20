import type { AppRouteIcon } from '../../app/routes'
import type { ReactNode } from 'react'

interface AppIconProps {
  name: AppRouteIcon
}

export function AppIcon({ name }: AppIconProps) {
  const paths: Record<AppRouteIcon, ReactNode> = {
    home: (
      <>
        <path d="m4 11 8-7 8 7" />
        <path d="M6.5 10v10h11V10M10 20v-6h4v6" />
      </>
    ),
    collection: (
      <>
        <path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z" />
        <path d="M8 4.5V20M11 9h5M11 13h5" />
      </>
    ),
    team: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 20a5.5 5.5 0 0 1 11 0M5 8a2.5 2.5 0 0 0 0 5M19 8a2.5 2.5 0 0 1 0 5" />
      </>
    ),
    activities: (
      <>
        <path d="M4 18h16M6 18l2-8 4 5 3-10 3 13" />
        <circle cx="8" cy="10" r="1" />
      </>
    ),
    expeditions: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    eggs: (
      <path d="M17.5 15.5c0 3.2-2.5 5.5-5.5 5.5s-5.5-2.3-5.5-5.5S8.5 3 12 3s5.5 9.3 5.5 12.5Z" />
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className="app-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}

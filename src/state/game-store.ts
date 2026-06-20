import { create } from 'zustand'

export type GameState = Record<string, never>

export const useGameStore = create<GameState>(() => ({}))

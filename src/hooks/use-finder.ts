import { create } from 'zustand'

interface FinderHookProps {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useFinder = create<FinderHookProps>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

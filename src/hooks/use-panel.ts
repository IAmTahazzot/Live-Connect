import { create } from 'zustand'

export enum PANEL_TYPES {
  PROFILE = 'PROFILE',
  SERVER = 'SERVER',
}

export type PanelType = keyof typeof PANEL_TYPES

interface PanelStore {
  type: PanelType | null
  isOpen: boolean
  onOpen: (type: PanelType) => void
  close: () => void
}

export const usePanel = create<PanelStore>(
  set =>
    ({
      type: null,
      isOpen: false,
      onOpen: type => set({ isOpen: true, type }),
      close: () => set({ type: null, isOpen: false }),
    } as PanelStore)
)

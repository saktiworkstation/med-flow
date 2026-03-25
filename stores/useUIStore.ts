import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  quickViewOpen: boolean;
  quickViewContent: { type: string; id: string } | null;
  theme: 'light' | 'dark' | 'system';

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openQuickView: (type: string, id: string) => void;
  closeQuickView: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      quickViewOpen: false,
      quickViewContent: null,
      theme: 'light',

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      openQuickView: (type, id) =>
        set({ quickViewOpen: true, quickViewContent: { type, id } }),
      closeQuickView: () => set({ quickViewOpen: false, quickViewContent: null }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'medflow-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  notifications: Notification[]
  modals: {
    payment: boolean
    demoDataLoader: boolean
    productQuickView: boolean
    productQuickViewId: string | null
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  createdAt: string
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  notifications: [],
  modals: {
    payment: false,
    demoDataLoader: false,
    productQuickView: false,
    productQuickViewId: null,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setModal: (state, action: PayloadAction<{ modal: keyof UIState['modals']; open: boolean; data?: unknown }>) => {
      const { modal, open, data } = action.payload
      state.modals[modal] = open as never
      
      if (modal === 'productQuickView' && data) {
        state.modals.productQuickViewId = data as string
      } else if (!open) {
        state.modals.productQuickViewId = null
      }
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setSearchOpen,
  toggleSearch,
  addNotification,
  removeNotification,
  clearNotifications,
  setModal,
} = uiSlice.actions

export default uiSlice.reducer

'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider } from '@/store/slices/themeSlice'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  )
}

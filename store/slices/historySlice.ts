import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type HistoryState = { items: string[] }
const initialState: HistoryState = { items: [] }

const MAX = 5

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<string>) {
      const city = action.payload.trim()
      if (!city) return
      state.items = [city, ...state.items.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, MAX)
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('history', JSON.stringify(state.items)) } catch {}
      }
    },
    loadFromStorage(state) {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('history')
          if (raw) state.items = JSON.parse(raw)
        } catch {}
      }
    },
    clearHistory(state) {
      state.items = []
      if (typeof window !== 'undefined') localStorage.removeItem('history')
    }
  }
})

export const { addCity, loadFromStorage, clearHistory } = historySlice.actions
export default historySlice.reducer

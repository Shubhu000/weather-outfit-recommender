import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type WeatherState = {
  data: any | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: WeatherState = {
  data: null,
  status: 'idle',
  error: null,
}

export const fetchWeather = createAsyncThunk('weather/fetch', async (city: string, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
    const json = await res.json()
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch weather')
    return json
  } catch (e: any) {
    return rejectWithValue(e.message || 'Network error')
  }
})

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clear(state) {
      state.data = null
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action: any) => {
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong'
      })
  }
})

export const { clear } = weatherSlice.actions
export default weatherSlice.reducer

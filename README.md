# Weather-Based Outfit Recommender (Next.js + Redux Toolkit + Tailwind)

A polished demo app where users search a city to view current weather and receive an outfit suggestion. Includes search history, autosuggest, theme toggle, animations, and graceful error handling.

## Tech

- Next.js 14 (App Router, TypeScript)
- Redux Toolkit for weather + history state
- Tailwind CSS for styling
- Framer Motion for subtle animations

## Setup

1. Install deps:

```bash
npm i
```

2. Copy env and add your key:

```bash
cp .env.example .env.local
# put your OPENWEATHER_API_KEY in .env.local
```

3. Run:

```bash
npm run dev
```

## Notes

- API is proxied via `/api/weather` to avoid exposing your API key on the client.
- City autosuggest uses OpenWeather Geocoding (`/api/weather?suggest=1&city=...`).
- History stores last 5 searches and persists in `localStorage`.
- Theme preference persists in `localStorage`.

## Folder Structure

- `app/` App Router pages and API routes
- `components/` UI components (SearchBar, WeatherCard, etc.)
- `store/` Redux store + slices, plus Theme provider

Enjoy!

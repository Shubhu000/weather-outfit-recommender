// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'; // <- https!

// small helper so we can timeout runaway requests
async function withTimeout<T>(p: Promise<T>, ms = 8000) {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error('Request timed out')), ms),
    ),
  ]);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const suggest = searchParams.get('suggest');
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server missing OPENWEATHER_API_KEY' },
      { status: 500 },
    );
  }

  try {
    if (suggest && city) {
      const url = `${GEO_URL}?q=${encodeURIComponent(
        city,
      )}&limit=5&appid=${apiKey}`;
      const res = await withTimeout(fetch(url));

      if (!res.ok) {
        // surface OpenWeather error
        const text = await res.text().catch(() => '');
        const msg = text || `Suggestion fetch failed (status ${res.status})`;
        return NextResponse.json({ error: msg }, { status: res.status });
      }

      const list = await res.json();
      const suggestions = (Array.isArray(list) ? list : []).map((c: any) => ({
        name: c.name,
        state: c.state,
        country: c.country,
      }));
      return NextResponse.json({ suggestions });
    }

    if (!city)
      return NextResponse.json({ error: 'Missing city' }, { status: 400 });

    const url = `${BASE_URL}?q=${encodeURIComponent(
      city,
    )}&appid=${apiKey}&units=metric`;
    const res = await withTimeout(fetch(url));

    if (!res.ok) {
      // give cleaner messages for common cases
      if (res.status === 404) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      const text = await res.text().catch(() => '');
      const msg = text || `Weather fetch failed (status ${res.status})`;
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    const msg = e?.message || 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

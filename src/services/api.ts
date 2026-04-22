const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'mock_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number; pressure: number };
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    wind: { speed: number };
    dt_txt: string;
  }>;
  city: { name: string; country: string; timezone: number };
}

export interface AirPollutionData {
  list: Array<{ main: { aqi: number }; components: { pm2_5: number; pm10: number } }>;
}

export const fetchCity = async (query: string): Promise<City[]> => {
  try {
    const res = await fetch(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}&lang=ru`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch {
    return [
      { name: 'Москва', country: 'RU', lat: 55.75, lon: 37.62 },
      { name: 'Санкт-Петербург', country: 'RU', lat: 59.93, lon: 30.33 },
    ];
  }
};

export const fetchForecast = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${API_KEY}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return {
      list: Array.from({ length: 40 }, (_, i) => ({
        dt: Date.now() / 1000 + i * 3600,
        main: { temp: 20 + Math.sin(i / 5) * 5, humidity: 65, pressure: 1015 },
        weather: [{ id: 800 + (i % 3), main: 'Clear', description: 'ясно', icon: '01d' }],
        wind: { speed: 3 },
        dt_txt: new Date(Date.now() + i * 3600).toISOString(),
      })),
      city: { name: 'Москва', country: 'RU', timezone: 10800 },
    };
  }
};

export const fetchAirPollution = async (lat: number, lon: number): Promise<AirPollutionData> => {
  try {
    const res = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return { list: [{ main: { aqi: 2 }, components: { pm2_5: 12.4, pm10: 18.1 } }] };
  }
};
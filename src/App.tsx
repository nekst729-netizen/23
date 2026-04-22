import { useState, useEffect } from 'react';
import { CitySearch } from './components/CitySearch';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastList } from './components/ForecastList';
import { AirQuality } from './components/AirQuality';
import { fetchForecast, fetchAirPollution } from './services/api';
import { getWeatherTheme } from './utils/weatherUtils';
import type { City } from './services/api';

export default function App() {
  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [air, setAir] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('clear');

  const loadData = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const [w, a] = await Promise.all([
        fetchForecast(city.lat, city.lon),
        fetchAirPollution(city.lat, city.lon),
      ]);
      setWeather(w);
      setAir(a);
      if (w.list[0]) setTheme(getWeatherTheme(w.list[0].weather[0].id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) return;
    loadData();
    const interval = setInterval(loadData, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  if (!city) return <CitySearch onSelect={setCity} />;

  return (
    <div className={`app-container theme-${theme}`}>
      <button className="back-btn" onClick={() => setCity(null)}>← Выбрать другой город</button>
      {loading ? (
        <p>Загрузка данных...</p>
      ) : weather && air ? (
        <>
          <h1 className="city-title">{city.name}, {city.country}</h1>
          <CurrentWeather data={weather} />
          <ForecastList data={weather} />
          <AirQuality data={air} />
        </>
      ) : null}
    </div>
  );
}
import { useState } from 'react';
import { fetchCity, City } from '../services/api';

export const CitySearch = ({ onSelect }: { onSelect: (city: City) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await fetchCity(query);
      setResults(data);
    } catch {
      alert('Не удалось найти город');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-box">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Введите город" />
      <button onClick={handleSearch} disabled={loading}>{loading ? 'Поиск...' : 'Найти'}</button>
      <ul className="city-list">
        {results.map(c => (
          <li key={`${c.name}-${c.lat}`} onClick={() => onSelect(c)}>{c.name}, {c.country}</li>
        ))}
      </ul>
    </div>
  );
};
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../services/api';

vi.mock('../services/api');

const mockCity = { name: 'Москва', country: 'RU', lat: 55.75, lon: 37.62 };
const mockForecast = {
  list: [{ dt: Date.now()/1000, main: { temp: 20, humidity: 60, pressure: 1015 }, weather: [{ id: 800, icon: '01d', description: 'ясно' }], wind: { speed: 3 }, dt_txt: '' }],
  city: { name: 'Москва', country: 'RU', timezone: 10800 }
};
const mockAir = { list: [{ main: { aqi: 2 }, components: { pm2_5: 12, pm10: 18 } }] };

beforeEach(() => {
  vi.mocked(api.fetchCity).mockResolvedValue([mockCity]);
  vi.mocked(api.fetchForecast).mockResolvedValue(mockForecast);
  vi.mocked(api.fetchAirPollution).mockResolvedValue(mockAir);
});

describe('Weather App', () => {
  it('показывает поле поиска при старте', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Введите город')).toBeInTheDocument();
  });

  it('загружает погоду после выбора города', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Введите город');
    fireEvent.change(input, { target: { value: 'Москва' } });
    fireEvent.click(screen.getByRole('button', { name: 'Найти' }));
    await waitFor(() => fireEvent.click(screen.getByText('Москва, RU')));
    await waitFor(() => expect(screen.getByText('Сейчас')).toBeInTheDocument());
  });
});
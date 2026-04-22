import { groupByDay } from '../utils/weatherUtils';

export const ForecastList = ({ data }: { data: any }) => {
  if (!data?.list?.length) return <p style={{ textAlign: 'center', padding: '20px' }}>Нет данных прогноза</p>;

  const days = groupByDay(data.list);

  return (
    <section className="card forecast">
      <h3>Прогноз на 5 дней</h3>
      <div className="days-grid">
        {days.map(([date, items]) => (
          <div key={date} className="day-card">
            <h4>{date}</h4>
            {items.slice(0, 4).map((item: any, idx: number) => (
              <div key={idx} className="hour-item">
                <span>{new Date(item.dt * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="" />
                <span>{Math.round(item.main.temp)}°</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
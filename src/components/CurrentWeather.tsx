export const CurrentWeather = ({ data }: { data: any }) => {
  const now = data.list[0];
  const temp = Math.round(now.main.temp);
  const icon = now.weather[0].icon;
  const desc = now.weather[0].description;
  const pressureMm = (now.main.pressure * 0.750062).toFixed(1);

  return (
    <section className="card current">
      <h2>Сейчас</h2>
      <div className="main-info">
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} />
        <span className="temp">{temp}°C</span>
      </div>
      <p style={{ textAlign: 'center', margin: '10px 0' }}>{desc}</p>
      <div className="details">
        <p>💧 Влажность: {now.main.humidity}%</p>
        <p>💨 Ветер: {now.wind.speed} м/с</p>
        <p>🌡 Давление: {pressureMm} мм рт. ст.</p>
      </div>
    </section>
  );
};
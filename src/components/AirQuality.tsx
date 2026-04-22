export const AirQuality = ({ data }: { data: any }) => {
  const aqi = data.list[0].main.aqi;
  const labels = ['Отлично', 'Хорошо', 'Умеренно', 'Плохо', 'Очень плохо'];
  const colors = ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336'];

  return (
    <section className="card air">
      <h3>Качество воздуха</h3>
      <div className="aqi-badge" style={{ backgroundColor: colors[aqi - 1] || colors[1] }}>
        Индекс AQI: {aqi}<br />{labels[aqi - 1] || 'Хорошо'}
      </div>
    </section>
  );
};
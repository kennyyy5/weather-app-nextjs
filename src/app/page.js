import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  // Handle search by location input
  const handleSearch = async () => {
    try {
      setError(null);
      const res = await fetch(`/api/weather?location=${location}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data.current);
        setForecast(data.forecast);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred while fetching weather data.');
    }
  };

  // Handle weather search using current geolocation
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setError(null);
          const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (res.ok) {
            setWeather(data.current);
            setForecast(data.forecast);
          } else {
            setError(data.error);
          }
        } catch (err) {
          setError('An error occurred while fetching weather data.');
        }
      }, () => {
        setError('Unable to access your location.');
      });
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <header>
        <h1>Weather App</h1>
        <p>Developed by Your Name</p>
        <p>
          PM Accelerator is a vibrant community that empowers product managers through insightful content,
          practical frameworks, and industry-leading connections.
        </p>
      </header>
      
      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (zip, city, etc.)"
          style={{ padding: '0.5rem', width: '250px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
          Search
        </button>
        <button onClick={handleCurrentLocation} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
          Use My Location
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {weather && (
        <div>
          <h2>Current Weather in {weather.name}</h2>
          <p>{weather.description}</p>
          <p>{weather.temp}°C</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>5-Day Forecast</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {forecast.map((day, index) => (
              <div key={index} style={{ border: '1px solid #ddd', padding: '1rem' }}>
                <h3>{day.date}</h3>
                <p>{day.description}</p>
                <p>{day.temp}°C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="weather icon"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
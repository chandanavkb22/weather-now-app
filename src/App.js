import "./styles.css";
import React, { useState } from "react";

// 🧭 Weather condition mapping (from Open-Meteo weather codes)
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  95: "Thunderstorm",
  99: "Hailstorm",
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name!");
      return;
    }

    setError("");
    setWeather(null);

    try {
      // 🌍 Step 1: Get latitude and longitude from city name
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Try again!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 🌦️ Step 2: Fetch current weather from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      const { temperature, windspeed, weathercode } =
        weatherData.current_weather;

      // ✅ Step 3: Set weather data
      setWeather({
        city: `${name}, ${country}`,
        temp: temperature,
        wind: windspeed,
        condition: weatherCodes[weathercode] || "Unknown",
      });
    } catch (err) {
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-sans p-6">
      <h1 className="text-3xl font-bold mb-6">🌤️ Weather Now</h1>

      <div className="bg-white text-black p-6 rounded-2xl shadow-md w-80 text-center">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={getWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Get Weather
        </button>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        {weather && (
          <div className="mt-4">
            <h2 className="font-semibold text-lg">{weather.city}</h2>
            <p className="text-gray-700 mt-1">
              🌡️ Temperature: {weather.temp}°C
            </p>
            <p className="text-gray-700">💨 Wind Speed: {weather.wind} km/h</p>
            <p className="text-gray-700">☁️ Condition: {weather.condition}</p>
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-200">
        Built by <strong>Chandana V</strong> — using Open-Meteo API
      </p>
    </div>
  );
}

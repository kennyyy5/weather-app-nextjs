import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.OPEN_WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing API key." },
      { status: 500 }
    );
  }

  let weatherUrl, forecastUrl;
  if (lat && lon) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else if (location) {
    const encodedLocation = encodeURIComponent(location);
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=metric&appid=${apiKey}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedLocation}&units=metric&appid=${apiKey}`;
  } else {
    return NextResponse.json(
      { error: "No location provided." },
      { status: 400 }
    );
  }

  try {
    // Fetch current weather data
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      const errorData = await weatherRes.json();
      return NextResponse.json(
        { error: errorData.message || "Location not found." },
        { status: weatherRes.status }
      );
    }
    const weatherData = await weatherRes.json();

    // Fetch forecast data
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) {
      const errorData = await forecastRes.json();
      return NextResponse.json(
        { error: errorData.message || "Forecast not found." },
        { status: forecastRes.status }
      );
    }
    const forecastData = await forecastRes.json();

    // Process 5-day forecast (taking one entry per day)
    const forecastList = [];
    const seenDates = new Set();
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!seenDates.has(date) && forecastList.length < 5) {
        seenDates.add(date);
        forecastList.push({
          date,
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      }
    });

    return NextResponse.json(
      {
        current: {
          name: weatherData.name,
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
        forecast: forecastList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

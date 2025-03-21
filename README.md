# Weather App

This is a simple weather application built with Next.js. The app allows users to:

- Enter a location (city, ZIP/postal code, etc.) to view current weather.
- Use their current geolocation to fetch weather information.
- See a 5-day weather forecast.
- Handle errors gracefully, such as invalid locations or failed API requests.

The app fetches weather data from the [OpenWeatherMap API](https://openweathermap.org), so you will need an API key to run the application.

## Features

- **Current Weather:** Displays the current weather, including temperature, description, and an icon.
- **5-Day Forecast:** Shows a forecast for the next 5 days.
- **Location Search:** Users can search using different location formats.
- **Geolocation:** Uses the browser's geolocation API to get weather for the user's current location.
- **Error Handling:** Provides clear error messages for invalid requests or network issues.

## Getting Started

### Prerequisites

- **Node.js & npm:** Ensure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org).

### Installation

1. run: git clone https://github.com/yourusername/weather-app.git
   cd weather-app

2. run : npm install

3. Add your OpenWeatherMap API key in an .env or .env.local file:
   OPEN_WEATHER_API_KEY=your_api_key_here

4. run: npm run dev to start dev server.

5. Visit http://localhost:3000 in your browser to view the app.


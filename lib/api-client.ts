/**
 * API client for communicating with the OpenWeatherMap API
 */

import type { WeatherData, ForecastData, DailyForecast } from "./types"

// API key and base URL
const API_KEY = "df5ac5b1d2babee9a3ef4334d8de1b1b"
const API_BASE_URL = "https://api.openweathermap.org/data/2.5"

/**
 * Fetch current weather data for a location
 */
export async function fetchWeatherData(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)

      // Try to parse as JSON, but handle case where it's not JSON
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(errorJson.message || `Error: ${response.status}`)
      } catch (e) {
        // If it's not JSON, throw a generic error with status code
        throw new Error(`API Error: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

/**
 * Fetch forecast data for a location
 */
export async function fetchForecastData(city: string): Promise<ForecastData> {
  try {
    const response = await fetch(`${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)

      // Try to parse as JSON, but handle case where it's not JSON
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(errorJson.message || `Error: ${response.status}`)
      } catch (e) {
        // If it's not JSON, throw a generic error with status code
        throw new Error(`API Error: ${response.status}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    throw error
  }
}

/**
 * Process forecast data into daily forecasts
 */
export function processForecastData(data: ForecastData): DailyForecast[] {
  const dailyData: { [key: string]: DailyForecast } = {}

  // Process the 3-hour forecast data into daily forecasts
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dateStr = date.toISOString().split("T")[0]

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = {
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
        icon: item.weather[0].icon,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0].main,
      }
    } else {
      // Update min/max temperatures if needed
      if (item.main.temp_min < dailyData[dateStr].temp_min) {
        dailyData[dateStr].temp_min = item.main.temp_min
      }
      if (item.main.temp_max > dailyData[dateStr].temp_max) {
        dailyData[dateStr].temp_max = item.main.temp_max
      }
    }
  })

  // Convert to array and sort by date
  return Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3) // Get only the next 3 days
}

/**
 * Map OpenWeatherMap icon codes to our custom icons
 */
export function getWeatherIcon(code: string): string {
  const iconMap: { [key: string]: string } = {
    "01d": "sun", // clear sky day
    "01n": "moon", // clear sky night
    "02d": "cloud-sun", // few clouds day
    "02n": "cloud-moon", // few clouds night
    "03d": "cloud", // scattered clouds
    "03n": "cloud",
    "04d": "cloud", // broken clouds
    "04n": "cloud",
    "09d": "cloud-rain", // shower rain
    "09n": "cloud-rain",
    "10d": "cloud-rain", // rain
    "10n": "cloud-rain",
    "11d": "cloud-lightning", // thunderstorm
    "11n": "cloud-lightning",
    "13d": "cloud-snow", // snow
    "13n": "cloud-snow",
    "50d": "cloud-fog", // mist
    "50n": "cloud-fog",
  }

  return iconMap[code] || "cloud"
}

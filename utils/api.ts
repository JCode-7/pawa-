/**
 * API utilities for interacting with the Laravel backend
 */

// Get API base URL from environment variable or use a relative URL as fallback
// Using a relative URL allows the app to work with the backend regardless of hosting environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
const OPENWEATHER_API_KEY = "df5ac5b1d2babee9a3ef4334d8de1b1b" // Fallback API key

/**
 * Geocode a city name to get latitude and longitude
 */
export const geocodeCity = async (city: string) => {
  try {
    // Try to use the backend API first
    try {
      const response = await fetch(`${API_BASE_URL}/geocode?city=${encodeURIComponent(city)}`)

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.warn("Backend geocoding failed, falling back to direct API call:", error)
      // Continue to fallback
    }

    // Fallback: Use OpenWeatherMap geocoding API directly
    console.log("Using fallback geocoding API")
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      throw new Error("City not found")
    }

    // Transform the response to match our expected format
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].name,
      country: data[0].country || "",
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    throw error
  }
}

/**
 * Fetch current weather data using latitude and longitude
 */
export const fetchWeather = async (lat: number, lon: number) => {
  try {
    // Try to use the backend API first
    try {
      const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`)

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.warn("Backend weather fetch failed, falling back to direct API call:", error)
      // Continue to fallback
    }

    // Fallback: Use OpenWeatherMap API directly
    console.log("Using fallback weather API")
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error(`Weather fetch failed: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Weather fetch error:", error)
    throw error
  }
}

/**
 * Fetch forecast data using latitude and longitude
 */
export const fetchForecast = async (lat: number, lon: number) => {
  try {
    // Try to use the backend API first
    try {
      const response = await fetch(`${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}`)

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.warn("Backend forecast fetch failed, falling back to direct API call:", error)
      // Continue to fallback
    }

    // Fallback: Use OpenWeatherMap API directly
    console.log("Using fallback forecast API")
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error(`Forecast fetch failed: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Forecast fetch error:", error)
    throw error
  }
}

/**
 * Get weather icon type based on icon code
 */
export const getWeatherIcon = (code: string): string => {
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

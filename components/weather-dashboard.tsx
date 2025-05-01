"use client"

import { useState, useEffect } from "react"
import WeatherForm from "./weather-form"
import UnitToggle from "./unit-toggle"
import WeatherDisplay from "./weather-display"
import ForecastDisplay from "./forecast-display"
import { WindDetail, HumidityDetail } from "./weather-detail"
import { fetchWeather, fetchForecast } from "@/utils/api"
import type { WeatherData, ForecastData, DailyForecast } from "@/utils/types"

export default function WeatherDashboard() {
  const [mounted, setMounted] = useState(false)
  const [unit, setUnit] = useState<"C" | "F">("C")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<DailyForecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C")
  }

  const handleSearch = async (lat: number, lon: number, cityName: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching weather data for:", cityName, "at", lat, lon)

      // Fetch weather and forecast data in parallel
      const [weatherData, forecastData] = await Promise.all([fetchWeather(lat, lon), fetchForecast(lat, lon)])

      console.log("Weather data received:", weatherData)
      console.log("Forecast data received:", forecastData)

      setWeather(weatherData)

      // Process forecast data
      const processedForecast = processForecastData(forecastData)
      setForecast(processedForecast)
    } catch (err) {
      console.error("Error fetching weather data:", err)
      if (err instanceof Error) {
        setError(err.message || "Failed to load weather data. Please try again.")
      } else {
        setError("Failed to load weather data. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Process forecast data into daily forecasts
  const processForecastData = (data: ForecastData): DailyForecast[] => {
    const dailyData: { [key: string]: DailyForecast } = {}

    // Process the 3-hour forecast data into daily forecasts
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const dateStr = date.toISOString().split("T")[0]

      if (!dailyData[dateStr]) {
        // Use a consistent date format that won't change between server and client
        const day = `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}`

        dailyData[dateStr] = {
          date: dateStr,
          day: day,
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

  // If not mounted yet, return a simple loading state
  if (!mounted) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-800 rounded-lg overflow-hidden">
          <div className="border-r border-gray-800">
            <div className="flex justify-center items-center h-full p-6">
              <div className="text-gray-500">Loading...</div>
            </div>
          </div>
          <div className="md:col-span-2 p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="w-full h-10"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-800 rounded-lg overflow-hidden">
        {/* Left column - Current weather */}
        <div className="border-r border-gray-800">
          {loading && !weather ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full p-6 text-center">
              <div className="text-red-500">{error}</div>
            </div>
          ) : weather ? (
            <WeatherDisplay data={weather} unit={unit} />
          ) : (
            <div className="flex justify-center items-center h-full p-6 text-center">
              <div className="text-gray-500">Search for a city to see weather information</div>
            </div>
          )}
        </div>

        {/* Right column - Search, forecast and details */}
        <div className="md:col-span-2 p-4">
          <div className="flex justify-between items-center mb-6">
            <WeatherForm onSearch={handleSearch} isLoading={loading} />
            <UnitToggle unit={unit} onToggle={toggleUnit} />
          </div>

          {/* Forecast section */}
          <ForecastDisplay data={forecast} unit={unit} isLoading={loading && !forecast.length} />

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-4">
            {weather ? (
              <>
                <WindDetail speed={weather.wind.speed} isLoading={loading} />
                <HumidityDetail humidity={weather.main.humidity} isLoading={loading} />
              </>
            ) : loading ? (
              <>
                <WindDetail speed={0} isLoading={true} />
                <HumidityDetail humidity={0} isLoading={true} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

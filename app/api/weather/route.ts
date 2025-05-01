import { type NextRequest, NextResponse } from "next/server"
import type { WeatherData } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const apiKey = "df5ac5b1d2babee9a3ef4334d8de1b1b" // Using the provided API key

  if (!location) {
    return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
  }

  try {
    // Fetch data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch weather data" },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Transform OpenWeatherMap data to our app's format
    const weatherData: WeatherData = {
      location: {
        name: data.name,
        region: "",
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
        localtime: new Date().toLocaleString(),
      },
      current: {
        temp_c: data.main.temp,
        temp_f: (data.main.temp * 9) / 5 + 32, // Convert to Fahrenheit
        condition: {
          text: data.weather[0].description,
          code: data.weather[0].id,
        },
        wind_kph: data.wind.speed * 3.6, // Convert m/s to km/h
        wind_mph: data.wind.speed * 2.237, // Convert m/s to mph
        humidity: data.main.humidity,
        feelslike_c: data.main.feels_like,
        feelslike_f: (data.main.feels_like * 9) / 5 + 32, // Convert to Fahrenheit
        uv: 0, // OpenWeatherMap doesn't provide UV index in the basic API
      },
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ message: "Failed to fetch weather data" }, { status: 500 })
  }
}

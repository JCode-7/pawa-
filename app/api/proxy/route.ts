/**
 * This is a temporary API proxy to simulate the Laravel backend
 * You should remove this once your Laravel backend is ready
 */

import { type NextRequest, NextResponse } from "next/server"

// OpenWeatherMap API key - this should be moved to your Laravel backend
const API_KEY = "df5ac5b1d2babee9a3ef4334d8de1b1b"

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)
  const path = pathname.replace("/api/proxy", "")

  // Extract the endpoint from the path
  const endpoint = path.split("/").pop()

  if (endpoint === "weather") {
    const location = searchParams.get("location")

    if (!location) {
      return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
    }

    try {
      // This is a temporary implementation - your Laravel backend will handle this
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          { message: errorData.message || "Failed to fetch weather data" },
          { status: response.status },
        )
      }

      const data = await response.json()

      // Transform to match the expected Laravel API response format
      const transformedData = {
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
          temp_f: (data.main.temp * 9) / 5 + 32,
          condition: {
            text: data.weather[0].description,
            code: data.weather[0].id,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          },
          wind_kph: data.wind.speed * 3.6,
          wind_mph: data.wind.speed * 2.237,
          humidity: data.main.humidity,
          feelslike_c: data.main.feels_like,
          feelslike_f: (data.main.feels_like * 9) / 5 + 32,
          uv: 0,
          pressure_mb: data.main.pressure,
          visibility_km: data.visibility / 1000,
          is_day: new Date().getHours() > 6 && new Date().getHours() < 20 ? 1 : 0,
        },
      }

      return NextResponse.json(transformedData)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return NextResponse.json({ message: "Failed to fetch weather data" }, { status: 500 })
    }
  } else if (endpoint === "forecast") {
    const location = searchParams.get("location")

    if (!location) {
      return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
    }

    try {
      // This is a temporary implementation - your Laravel backend will handle this
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          { message: errorData.message || "Failed to fetch forecast data" },
          { status: response.status },
        )
      }

      const data = await response.json()

      // Process the forecast data to match the expected Laravel API response format
      const dailyData: Record<string, any> = {}

      // Group forecast data by day
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0]

        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            temps: [],
            icons: [],
            descriptions: [],
            wind: [],
            humidity: [],
            hours: [],
          }
        }

        dailyData[date].temps.push(item.main.temp)
        dailyData[date].icons.push(item.weather[0].id)
        dailyData[date].descriptions.push(item.weather[0].description)
        dailyData[date].wind.push(item.wind.speed)
        dailyData[date].humidity.push(item.main.humidity)

        // Add hourly data
        dailyData[date].hours.push({
          time: new Date(item.dt * 1000).toISOString(),
          temp_c: item.main.temp,
          temp_f: (item.main.temp * 9) / 5 + 32,
          condition: {
            text: item.weather[0].description,
            code: item.weather[0].id,
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          },
          chance_of_rain: Math.round(Math.random() * 100), // OpenWeatherMap doesn't provide this in the free tier
          chance_of_snow: Math.round(Math.random() * 20),
        })
      })

      // Calculate daily averages and most common weather condition
      const forecastDays = Object.values(dailyData)
        .map((day: any) => {
          // Get the most frequent weather condition
          const modeIcon = mode(day.icons)
          const modeDescription = mode(day.descriptions)

          return {
            date: day.date,
            day: {
              maxtemp_c: Math.max(...day.temps),
              maxtemp_f: (Math.max(...day.temps) * 9) / 5 + 32,
              mintemp_c: Math.min(...day.temps),
              mintemp_f: (Math.min(...day.temps) * 9) / 5 + 32,
              avgtemp_c: average(day.temps),
              avgtemp_f: (average(day.temps) * 9) / 5 + 32,
              condition: {
                text: modeDescription,
                code: modeIcon,
                icon: `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
              },
              daily_chance_of_rain: Math.round(Math.random() * 100), // Mock data
              daily_chance_of_snow: Math.round(Math.random() * 20), // Mock data
              uv: Math.round(Math.random() * 10), // Mock data
            },
            astro: {
              sunrise: "06:00 AM", // Mock data
              sunset: "06:00 PM", // Mock data
            },
            hour: day.hours,
          }
        })
        .slice(0, 5) // Limit to 5 days

      const transformedData = {
        location: {
          name: data.city.name,
          region: "",
          country: data.city.country,
          lat: data.city.coord.lat,
          lon: data.city.coord.lon,
          localtime: new Date().toLocaleString(),
        },
        forecast: {
          forecastday: forecastDays,
        },
      }

      return NextResponse.json(transformedData)
    } catch (error) {
      console.error("Error fetching forecast data:", error)
      return NextResponse.json({ message: "Failed to fetch forecast data" }, { status: 500 })
    }
  }

  return NextResponse.json({ message: "Endpoint not found" }, { status: 404 })
}

// Helper function to calculate average
function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// Helper function to find the most frequent value in an array
function mode(arr: any[]): any {
  const counts = arr.reduce((acc: Record<string, number>, val: any) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0])[0]
}

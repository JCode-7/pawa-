import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const apiKey = "df5ac5b1d2babee9a3ef4334d8de1b1b" // Using the provided API key

  if (!location) {
    return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
  }

  try {
    // Fetch 5-day forecast data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch forecast data" },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Process the forecast data to get daily forecasts
    const dailyForecasts = processForecastData(data)

    return NextResponse.json(dailyForecasts)
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    return NextResponse.json({ message: "Failed to fetch forecast data" }, { status: 500 })
  }
}

// Process the 3-hour forecast data into daily forecasts
function processForecastData(data: any) {
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
      }
    }

    dailyData[date].temps.push(item.main.temp)
    dailyData[date].icons.push(item.weather[0].id)
    dailyData[date].descriptions.push(item.weather[0].description)
    dailyData[date].wind.push(item.wind.speed)
    dailyData[date].humidity.push(item.main.humidity)
  })

  // Calculate daily averages and most common weather condition
  return Object.values(dailyData)
    .map((day: any) => {
      // Get the most frequent weather condition
      const modeIcon = mode(day.icons)
      const modeDescription = mode(day.descriptions)

      return {
        date: day.date,
        temp_max: Math.max(...day.temps),
        temp_min: Math.min(...day.temps),
        temp_avg: average(day.temps),
        condition: {
          code: modeIcon,
          text: modeDescription,
        },
        wind_speed: average(day.wind),
        humidity: average(day.humidity),
      }
    })
    .slice(0, 5) // Limit to 5 days
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

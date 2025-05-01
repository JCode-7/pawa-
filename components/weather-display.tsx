"use client"

import { useEffect, useState } from "react"
import WeatherIcon from "./weather-icon"
import { getWeatherIcon } from "@/utils/api"
import type { WeatherData } from "@/utils/types"

interface WeatherDisplayProps {
  data: WeatherData | null
  unit: "C" | "F"
}

export default function WeatherDisplay({ data, unit }: WeatherDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same structure during server-side rendering
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-32 h-32 mb-4"></div>
        <div className="text-4xl font-bold mb-2">--°{unit}</div>
        <div className="text-xl mb-6">Loading...</div>
        <div className="text-sm text-center mt-auto">
          <br />
        </div>
      </div>
    )
  }

  if (!data) return null

  const temperature = unit === "C" ? data.main.temp : (data.main.temp * 9) / 5 + 32
  const formattedTemp = Math.round(temperature)

  // Use a consistent date format that won't change between server and client
  const date = new Date(data.dt * 1000)
  const formattedDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

  const iconType = getWeatherIcon(data.weather[0].icon)

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <WeatherIcon iconType={iconType} className="w-32 h-32 mb-4" />

      <div className="text-4xl font-bold mb-2">
        {formattedTemp}°{unit}
      </div>

      <div className="text-xl mb-6 capitalize">{data.weather[0].description}</div>

      <div className="text-sm text-center mt-auto">
        {formattedDate}
        <br />
        {data.name}, {data.sys.country}
      </div>
    </div>
  )
}

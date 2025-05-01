"use client"

import { useEffect, useState } from "react"
import WeatherIcon from "./weather-icon"
import { getWeatherIcon } from "@/utils/api"

interface ForecastCardProps {
  day: string
  minTemp: number
  maxTemp: number
  iconCode: string
  unit: "C" | "F"
}

export default function ForecastCard({ day, minTemp, maxTemp, iconCode, unit }: ForecastCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formattedMinTemp = Math.round(minTemp)
  const formattedMaxTemp = Math.round(maxTemp)
  const iconType = getWeatherIcon(iconCode)

  // Use a simple structure during server-side rendering
  if (!mounted) {
    return (
      <div className="weather-card p-4 flex flex-col items-center">
        <div className="text-sm mb-4">{day}</div>
        <div className="w-16 h-16 mb-4"></div>
        <div className="text-xs">--°{unit}</div>
      </div>
    )
  }

  return (
    <div className="weather-card p-4 flex flex-col items-center">
      <div className="text-sm mb-4">{day}</div>

      <WeatherIcon iconType={iconType} className="w-16 h-16 mb-4" />

      <div className="text-xs">
        {formattedMinTemp}-{formattedMaxTemp}°{unit}
      </div>
    </div>
  )
}

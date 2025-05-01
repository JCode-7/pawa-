"use client"

import { useEffect, useState } from "react"
import ForecastCard from "./forecast-card"
import type { DailyForecast } from "@/utils/types"

interface ForecastDisplayProps {
  data: DailyForecast[]
  unit: "C" | "F"
  isLoading: boolean
}

export default function ForecastDisplay({ data, unit, isLoading }: ForecastDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="weather-card p-4 flex flex-col items-center">
            <div className="animate-pulse bg-gray-700 h-4 w-16 mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-700 h-16 w-16 mb-4 rounded-full"></div>
            <div className="animate-pulse bg-gray-700 h-4 w-24 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="weather-card p-4 flex flex-col items-center">
            <div className="text-sm mb-4">Loading...</div>
            <div className="w-16 h-16 mb-4"></div>
            <div className="text-xs">--°{unit}</div>
          </div>
        ))}
      </div>
    )
  }

  if (!data.length) {
    return null
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {data.map((day, index) => {
        const minTemp = unit === "C" ? day.temp_min : (day.temp_min * 9) / 5 + 32
        const maxTemp = unit === "C" ? day.temp_max : (day.temp_max * 9) / 5 + 32

        return (
          <ForecastCard
            key={index}
            day={day.day}
            minTemp={Math.round(minTemp)}
            maxTemp={Math.round(maxTemp)}
            iconCode={day.icon}
            unit={unit}
          />
        )
      })}
    </div>
  )
}

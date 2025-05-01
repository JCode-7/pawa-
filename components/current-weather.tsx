"use client"

import WeatherIcon from "./weather-icon"
import { getWeatherIcon } from "@/lib/api"
import { format } from "date-fns"

interface CurrentWeatherProps {
  city: string
  country: string
  temperature: number
  description: string
  iconCode: string
  date: number
  unit: "C" | "F"
}

export default function CurrentWeather({
  city,
  country,
  temperature,
  description,
  iconCode,
  date,
  unit,
}: CurrentWeatherProps) {
  const formattedTemp = Math.round(temperature)
  const formattedDate = format(new Date(date * 1000), "do MMM yyyy")
  const iconType = getWeatherIcon(iconCode)

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <WeatherIcon iconType={iconType} className="w-32 h-32 mb-4" />

      <div className="text-4xl font-bold mb-2">
        {formattedTemp}°{unit}
      </div>

      <div className="text-xl mb-6 capitalize">{description}</div>

      <div className="text-sm text-center mt-auto">
        {formattedDate}
        <br />
        {city}, {country}
      </div>
    </div>
  )
}

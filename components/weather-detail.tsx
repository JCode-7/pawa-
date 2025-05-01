"use client"

import { useEffect, useState } from "react"
import { Wind } from "lucide-react"

interface WindDetailProps {
  speed: number
  isLoading: boolean
}

export function WindDetail({ speed, isLoading }: WindDetailProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) {
    return (
      <div className="weather-card p-4 animate-pulse">
        <div className="bg-gray-700 h-4 w-24 mb-4 mx-auto rounded"></div>
        <div className="bg-gray-700 h-8 w-16 mb-2 mx-auto rounded"></div>
        <div className="bg-gray-700 h-4 w-12 mx-auto rounded"></div>
      </div>
    )
  }

  // Use a simple structure during server-side rendering
  if (!mounted) {
    return (
      <div className="weather-card p-4 flex flex-col items-center">
        <div className="text-sm mb-4">Wind Status</div>
        <div className="text-3xl font-bold mb-2">-- km/h</div>
      </div>
    )
  }

  const formattedSpeed = Math.round(speed)

  return (
    <div className="weather-card p-4 flex flex-col items-center">
      <div className="text-sm mb-4">Wind Status</div>

      <div className="text-3xl font-bold mb-2">{formattedSpeed} km/h</div>

      <div className="flex items-center text-xs text-gray-400">
        <Wind className="w-4 h-4 mr-1" />
        <span>WSW</span>
      </div>
    </div>
  )
}

interface HumidityDetailProps {
  humidity: number
  isLoading: boolean
}

export function HumidityDetail({ humidity, isLoading }: HumidityDetailProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading) {
    return (
      <div className="weather-card p-4 animate-pulse">
        <div className="bg-gray-700 h-4 w-24 mb-4 mx-auto rounded"></div>
        <div className="bg-gray-700 h-8 w-16 mb-4 mx-auto rounded"></div>
        <div className="bg-gray-700 h-2 w-full rounded"></div>
      </div>
    )
  }

  // Use a simple structure during server-side rendering
  if (!mounted) {
    return (
      <div className="weather-card p-4 flex flex-col items-center">
        <div className="text-sm mb-4">Humidity</div>
        <div className="text-3xl font-bold mb-4">--%</div>
      </div>
    )
  }

  return (
    <div className="weather-card p-4 flex flex-col items-center">
      <div className="text-sm mb-4">Humidity</div>

      <div className="text-3xl font-bold mb-4">{humidity}%</div>

      <div className="w-full mt-2">
        <div className="humidity-bar">
          <div className="humidity-bar-fill" style={{ width: `${humidity}%` }}></div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">100</span>
        </div>
      </div>
    </div>
  )
}

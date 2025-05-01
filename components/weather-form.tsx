"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { geocodeCity } from "@/utils/api"

interface WeatherFormProps {
  onSearch: (lat: number, lon: number, cityName: string) => void
  isLoading: boolean
}

export default function WeatherForm({ onSearch, isLoading }: WeatherFormProps) {
  const [city, setCity] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city.trim()) return

    try {
      setError(null)
      console.log("Searching for city:", city.trim())
      const data = await geocodeCity(city.trim())
      console.log("Geocoding result:", data)
      const { lat, lon, name } = data
      onSearch(lat, lon, name)
    } catch (error) {
      console.error("Geocoding error:", error)
      if (error instanceof Error) {
        setError(error.message || "Failed to find location")
      } else {
        setError("Failed to find location. Please try again.")
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="w-full py-2 px-4 pr-10 rounded search-box text-white"
            aria-label="Search for a city"
            disabled={isLoading}
          />
          {error && <div className="absolute text-red-500 text-xs mt-1">{error}</div>}
        </div>
      </form>
      <button
        onClick={handleSubmit}
        className={`p-2 rounded search-box ${isLoading ? "opacity-50" : ""}`}
        aria-label="Search"
        disabled={isLoading || !city.trim()}
      >
        <Search className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
      </button>
    </div>
  )
}

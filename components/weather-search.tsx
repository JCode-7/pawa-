"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface WeatherSearchProps {
  onSearch: (location: string) => void
}

export default function WeatherSearch({ onSearch }: WeatherSearchProps) {
  const [location, setLocation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      onSearch(location.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name or zip code"
            className="pr-10 text-black dark:text-white placeholder:text-gray-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            aria-label="Location search"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <Button type="submit" disabled={!location.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
          Search
        </Button>
      </div>
    </form>
  )
}

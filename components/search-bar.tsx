"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      setIsSearching(true)
      onSearch(city)
      // Reset searching state after a short delay
      setTimeout(() => setIsSearching(false), 1000)
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
          />
        </div>
      </form>
      <button
        onClick={handleSubmit}
        className={`p-2 rounded search-box ${isSearching ? "opacity-50" : ""}`}
        aria-label="Search"
        disabled={isSearching || !city.trim()}
      >
        <Search className={`w-5 h-5 ${isSearching ? "animate-pulse" : ""}`} />
      </button>
    </div>
  )
}

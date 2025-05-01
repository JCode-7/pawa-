"use client"

import { useEffect, useState } from "react"

interface UnitToggleProps {
  unit: "C" | "F"
  onToggle: () => void
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex rounded-md unit-toggle">
        <button className="px-3 py-1 rounded-l" aria-label="Celsius">
          °C
        </button>
        <button className="px-3 py-1 rounded-r" aria-label="Fahrenheit">
          °F
        </button>
      </div>
    )
  }

  return (
    <div className="flex rounded-md unit-toggle">
      <button
        className={`px-3 py-1 rounded-l ${unit === "C" ? "unit-toggle-active" : ""}`}
        onClick={() => unit !== "C" && onToggle()}
        aria-label="Celsius"
      >
        °C
      </button>
      <button
        className={`px-3 py-1 rounded-r ${unit === "F" ? "unit-toggle-active" : ""}`}
        onClick={() => unit !== "F" && onToggle()}
        aria-label="Fahrenheit"
      >
        °F
      </button>
    </div>
  )
}

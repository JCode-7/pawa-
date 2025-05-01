import type React from "react"
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  CloudSun,
  CloudMoon,
} from "lucide-react"

interface WeatherIconProps {
  iconType?: string
  className?: string
  condition?: number
}

export default function WeatherIcon({ iconType, className = "w-24 h-24", condition }: WeatherIconProps) {
  // Default to 'cloud' if iconType is not provided
  const icon = iconType || "cloud"

  const iconMap: { [key: string]: React.ReactNode } = {
    sun: <Sun className={className} />,
    moon: <Moon className={className} />,
    cloud: <Cloud className={className} />,
    "cloud-rain": <CloudRain className={className} />,
    "cloud-snow": <CloudSnow className={className} />,
    "cloud-fog": <CloudFog className={className} />,
    "cloud-lightning": <CloudLightning className={className} />,
    "cloud-drizzle": <CloudDrizzle className={className} />,
    "cloud-sun": <CloudSun className={className} />,
    "cloud-moon": <CloudMoon className={className} />,
  }

  // If we have a condition code but no icon type, we can try to map it
  if (condition && !iconType) {
    // Map condition codes to icon types
    if (condition >= 200 && condition < 300) return <CloudLightning className={className} /> // Thunderstorm
    if (condition >= 300 && condition < 400) return <CloudDrizzle className={className} /> // Drizzle
    if (condition >= 500 && condition < 600) return <CloudRain className={className} /> // Rain
    if (condition >= 600 && condition < 700) return <CloudSnow className={className} /> // Snow
    if (condition >= 700 && condition < 800) return <CloudFog className={className} /> // Atmosphere
    if (condition === 800) return <Sun className={className} /> // Clear
    if (condition > 800) return <CloudSun className={className} /> // Clouds
  }

  return <div className="weather-icon">{iconMap[icon] || <Cloud className={className} />}</div>
}

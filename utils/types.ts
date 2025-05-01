/**
 * Type definitions for the weather app
 */

export interface GeocodingResult {
  lat: number
  lon: number
  name: string
  country: string
}

export interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
    id: number
  }>
  wind: {
    speed: number
    deg: number
  }
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
  timezone: number
  visibility: number
  cod: number
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
    id: number
  }>
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  pop: number
  dt_txt: string
}

export interface ForecastData {
  list: ForecastItem[]
  city: {
    name: string
    country: string
    sunrise: number
    sunset: number
    timezone: number
  }
  cod: string
  message: number
  cnt: number
}

export interface DailyForecast {
  date: string
  day: string
  icon: string
  temp_min: number
  temp_max: number
  weather: string
}

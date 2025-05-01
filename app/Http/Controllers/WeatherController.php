<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function geocode(Request $request)
    {
        $city = $request->query('city');
        $apiKey = env('OPENWEATHER_API_KEY');
        $response = Http::get("http://api.openweathermap.org/geo/1.0/direct", [
            'q' => $city,
            'limit' => 1,
            'appid' => $apiKey,
        ]);

        if ($response->successful() && count($response->json()) > 0) {
            $data = $response->json()[0];
            return response()->json([
                'lat' => $data['lat'],
                'lon' => $data['lon'],
            ]);
        }

        return response()->json(['error' => 'City not found'], 404);
    }

    public function weather(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $apiKey = env('OPENWEATHER_API_KEY');
        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => 'metric',
            'appid' => $apiKey,
        ]);

        return $response->json();
    }

    public function forecast(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $apiKey = env('OPENWEATHER_API_KEY');
        $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => 'metric',
            'appid' => $apiKey,
        ]);

        $data = $response->json();
        $dailyForecasts = [];

        foreach ($data['list'] as $item) {
            $date = substr($item['dt_txt'], 0, 10);
            if (!isset($dailyForecasts[$date])) {
                $dailyForecasts[$date] = [
                    'dt' => $item['dt'],
                    'temp' => [
                        'min' => $item['main']['temp_min'],
                        'max' => $item['main']['temp_max'],
                    ],
                    'weather' => $item['weather'],
                ];
            }
        }

        // Return the next 3 days
        return array_slice(array_values($dailyForecasts), 0, 3);
    }

    public function show(User $user)
{
    return $user;
}

}


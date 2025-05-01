<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/weather', [WeatherController::class, 'getCurrentWeather']);
Route::get('/forecast', [WeatherController::class, 'getForecast']);
Route::get('/geocode', [WeatherController::class, 'geocode']);
Route::get('/weather', [WeatherController::class, 'weather']);
Route::get('/forecast', [WeatherController::class, 'forecast']);

// Example protected route (optional, remove if unused)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users/{user}', [UserController::class, 'show'])
    ->missing(function () {
        return response()->view('errors.custom-404', [], 404);
    });

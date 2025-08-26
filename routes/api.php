<?php

use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\UserController;

Route::apiResource('todos', TodoController::class)->withoutMiddleware('auth');
Route::apiResource('users', UserController::class)->withoutMiddleware('auth');

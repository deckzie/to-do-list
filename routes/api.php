<?php

use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::apiResource('todos', TodoController::class);

Route::apiResource('users', UserController::class)->withoutMiddleware('auth');

Route::apiResource('categories', CategoryController::class);

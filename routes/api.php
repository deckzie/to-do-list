<?php

use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/login', function (Request $request) {
    \Log::info('Login Request:', $request->all());

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        \Log::error('Invalid credentials for email: ' . $request->email);
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    \Log::info('User logged in:', ['id' => $user->id]);

    return response()->json([
        'token' => $user->createToken('todo-token')->plainTextToken,
        'user' => $user
    ]);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/todos', function (Request $request) {
    return $request->user()->todos()->paginate($request->get('per_page', 10));
});


Route::apiResource('todos', TodoController::class)->withoutMiddleware('auth');
Route::apiResource('users', UserController::class)->withoutMiddleware('auth');

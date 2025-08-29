<?php

use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user) {
        \Log::error('Invalid email: ' . $request->email);
        throw ValidationException::withMessages([
            'email' => ['The provided email does not exist.'],
        ]);
    }

    if (! Hash::check($request->password, $user->password)) {
        \Log::error('Invalid password for email: ' . $request->email);
        throw ValidationException::withMessages([
            'password' => ['The provided password is incorrect.'],
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


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('todos', TodoController::class);
});

Route::apiResource('users', UserController::class)->withoutMiddleware('auth');

Route::post('/check-email', [UserController::class, 'checkEmail']);

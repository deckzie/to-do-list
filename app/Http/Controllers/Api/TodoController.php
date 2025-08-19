<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    // For simplicity (no auth yet), we’ll use the seeded user (id=1 or demo email)
    protected function demoUserId(): int
    {
        return User::where('email','demo@example.com')->value('id') ?? 1;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Todo::with('user')->where('user_id', $this->demoUserId());

        // Filter by status if present
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by search term if present
        if ($search = $request->query('search')){
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Limit per_page to 1-100)
        $perPage = min(max((int) $request->query('per_page', 10), 1), 10);

        // Paginate the results
        return response()->json(
            $query->orderByDesc('id')->paginate($perPage)->withQueryString()
        );

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        $todo = Todo::create(array_merge(
            $request->validated(),
            ['user_id' => $this->demoUserId()]
        ));

        return response()->json($todo->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        $this->authorizeView($todo);
        return response()->json($todo->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $this->authorizeView($todo);
        $todo->update($request->validated());
        return response()->json($todo->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $this->authorizeView($todo);
        $todo->delete();
        return response()->json(null, 204);
    }

    // Authorize the user to view the todo item
    protected function authorizeView(Todo $todo): void
    {
        abort_unless($todo->user_id === $this->demoUserId(), 403,'Forbidden');
    }
}

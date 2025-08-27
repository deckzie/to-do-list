<?php
namespace App\Http\Controllers\Api;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10); // default to 10 items per page
        $todos = Todo::paginate($perPage);

        return response()->json($todos);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'completed' => 'boolean',
        ]);

        return Todo::create($validated);
    }

    public function show(Todo $todo)
    {
        return $todo;
    }

    public function update(Request $request, Todo $todo)
    {
        $todo->update($request->only(['title', 'completed']));
        return $todo;
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->noContent();
    }
}

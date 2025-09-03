<?php
namespace App\Http\Controllers\Api;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        // Get todos of the authenticated user
        $query = $request->user()->todos();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('completed')) {
            $completed = filter_var($request->completed, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($completed)) {
                $query->where('completed', $completed);
            }
        }

        if ($request->filled('category')) {
            $category = $request->get('category');
            $query->where('category', 'like', "%{$category}%");
        }

        return response()->json($query->paginate($perPage));
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'category' => 'nullable|string|max:255'
        ]);

        // Assign the authenticated user's ID to the todo
        $validated['user_id'] = $request->user()->id;
        
        $todo = Todo::create($validated);

        return response()->json($todo, 201);
    }


    public function show(Todo $todo)
    {
        return $todo;
    }

    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
            'category' => 'nullable|string|max:255',
        ]);

        $todo->update($validated);
        return $todo;
    }


    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->noContent();
    }
}

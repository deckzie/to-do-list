<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specificUserId = 12; // Replace with the desired user ID

        Todo::factory()->count(100)->create([
            'user_id' => $specificUserId,
        ]);
    }
}

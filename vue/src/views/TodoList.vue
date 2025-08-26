<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const todos = computed(() => store.state.todos.data);
const loading = computed(() => store.state.todos.loading);

onMounted(() => {
  store.dispatch('getTodos');
});
</script>


<template>
  <div class="max-w-md mx-auto mt-10 space-y-1">
    <h1 class="text-2xl font-bold text-center text-green-700 mb-6">TodoList</h1>
    <div
      v-for="(todo, index) in todos"
      :key="index"
      class="flex items-center justify-between bg-white shadow p-4 rounded-lg"
    >
      <div class="flex items-center space-x-3">
        <input
          type="checkbox"
          v-model="todo.completed"
          class="form-checkbox h-5 w-5 text-green-500"
        />
        <span
          :class="{
            'line-through text-gray-400': todo.completed,
            'text-gray-800': !todo.completed
          }"
        >
          {{ todo.title }}
        </span>
      </div>
      <div class="flex space-x-2">
        <button @click="editTodo(index)" class="text-grey-500 hover:text-blue-700" title="Edit task">
           <PencilSquareIcon class="w-5 h-5" />
        </button>
        <button @click="deleteTodo(index)" class="text-grey-500 hover:text-red-700" title="Delete task">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>


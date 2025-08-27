<script setup>
  import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  import { onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ref } from 'vue';
  import { watch } from 'vue'
  import TodoForm from '../components/TodoForm.vue';
  import Pagination from '../components/Pagination.vue';

  const showForm = ref(false);
  const selectedTodo = ref(null);

  const store = useStore();

  const todos = computed(() => store.state.todos.data);
  const pagination = computed(() => store.state.todos.meta);
  const loading = computed(() => store.state.todos.loading);

  const searchQuery = ref('');
  const statusFilter = ref('');

  watch([searchQuery, statusFilter], () => {
    loadPage(1); // reset to first page on filter change
  });


  onMounted(() => {
    store.dispatch('getTodos').then(() => {
      console.log('Fetched Todos:', todos.value); // Print todos after fetching
    });
  });

  function loadPage(page) {
  const params = {
    page,
    search: searchQuery.value,
    completed: statusFilter.value
  };

  store.dispatch('getTodos', params).then(() => {
    console.log('Fetched with filters:', params);
  });
}


  function deleteTodo(index) {
    const todoId = todos.value[index].id;
    console.log('Deleting todo with ID:', todoId);
    store.dispatch('deleteTodo', todoId);
  }

  function editTodo(index) {
    selectedTodo.value = todos.value[index];
    console.log('Editing todo:', selectedTodo.value);
    showForm.value = true;
  }

  function addTodo() {
    selectedTodo.value = null;
    showForm.value = true;
  }

  function handleSubmit(todoData) {
    console.log('Submitting todo:', todoData);

    if (todoData.id) {
      store.dispatch('updateTodo', todoData);
    } else {
      store.dispatch('addTodo', todoData);
    }

    showForm.value = false;
  }

  function toggleCompleted(todo) {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed // flip the boolean
    };
    store.dispatch('updateTodo', updatedTodo);
  }
</script>

<template>
  <div class="w-7/10 mx-auto mt-5 space-y-3">
    <h1 class="text-2xl font-bold text-center text-green-700 mb-6">TodoList</h1>
    
    <!-- search and filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by title or description..."
        class="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <select
        v-model="statusFilter"
        class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All</option>
        <option value="1">Completed</option>
        <option value="0">Pending</option>
      </select>
    </div>

    <div
      v-for="(todo, index) in todos"
      :key="index"
      class="flex items-center justify-between bg-white shadow p-4 rounded-lg cursor-pointer"
      @click="editTodo(index)"
    >
      <!-- Left side: checkbox + title -->
      <div class="flex items-center space-x-3 flex-1 overflow-hidden">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change.stop="toggleCompleted(todo)"
          class="form-checkbox h-5 w-5 text-green-500 flex-shrink-0"
        />
        <span
          class="truncate w-full"
          :class="{
            'line-through text-gray-400': todo.completed,
            'text-gray-800': !todo.completed
          }"
        >
          {{ todo.title }}
        </span>
      </div>

      <!-- Right side: buttons -->
      <div class="flex space-x-1 flex-shrink-0" @click.stop>
        <button @click="editTodo(index)" class="text-gray-500 hover:text-gray-700" title="Edit task">
          <PencilSquareIcon class="w-5 h-5" />
        </button>
        <button @click="deleteTodo(index)" class="text-gray-500 hover:text-gray-700" title="Delete task">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <!-- Pagination Component -->
    <div class=" mt-4">
      <Pagination :pagination="pagination" @page-change="loadPage" />
    </div>
  </div>


  <TodoForm
    v-if="showForm"
    :todo="selectedTodo"
    @submit="handleSubmit"
  />
</template>


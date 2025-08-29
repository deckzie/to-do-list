<script setup>
  import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  import { onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ref } from 'vue';
  import { watch } from 'vue'
  import TodoForm from '../components/TodoForm.vue';
  import Pagination from '../components/Pagination.vue';
  import SearchFilter from '../components/SearchFilter.vue';
  import { useRouter } from 'vue-router';

  const showForm = ref(false);
  const selectedTodo = ref(null);
  const showProfileMenu = ref(false);

  const store = useStore();
  const router = useRouter();

  const todos = computed(() => store.state.todos.data);
  const pagination = computed(() => store.state.todos.meta);
  const loading = computed(() => store.state.todos.loading);

  const searchQuery = ref('');
  const statusFilter = ref('');
  const perPage = ref(10); // default value

  watch([searchQuery, statusFilter, perPage], () => {
    loadPage(1); // reset to page 1 when filters or perPage change
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
      completed: statusFilter.value,
      per_page: perPage.value,
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

  const user = JSON.parse(localStorage.getItem('user'));

  function toggleProfileMenu() {
    showProfileMenu.value = !showProfileMenu.value;
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  }
</script>

<template>
  <div class="w-7/10 mx-auto mt-5 space-y-3">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-center text-green-700">{{ user.name }}'s Todo List</h1>
      <div class="relative">
        <button @click="toggleProfileMenu" class="px-4 py-2 bg-gray-200 rounded-md">{{ user.name }}</button>
        <div v-if="showProfileMenu" class="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md">
          <button @click="logout" class="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">Log Out</button>
        </div>
      </div>
    </div>

    <!-- add Todo button -->
    <button @click="addTodo" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
      Add Todo
    </button>

    <!-- search and filter -->
    <SearchFilter
    v-model:searchQuery="searchQuery"
    v-model:statusFilter="statusFilter"
    />
    
    <!-- Display message if no todos -->
    <div v-if="todos.length === 0" class="text-center text-black mt-4">
      You have no Todos yet.
    </div>
    
    <!-- Number of items -->
    <div v-if="todos.length > 0" class="flex items-center justify-end mb-4">
      <label for="perPage" class="mr-2 text-sm text-gray-600">Items per page:</label>
      <select
        id="perPage"
        v-model="perPage"
        class="px-2 justify-center py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>

    <div
      v-for="(todo, index) in todos"
      :key="index"
      class="flex items-center justify-between bg-white shadow p-4 rounded-lg"
      @click="toggleCompleted(todo)"
    >
      <!-- Left side: checkbox + title -->
      <div class="flex items-center space-x-3 flex-1 overflow-hidden cursor-pointer">
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
        <button @click="editTodo(index)" class="text-gray-500 hover:text-gray-700 cursor-pointer" title="Edit task">
          <PencilSquareIcon class="w-5 h-5" />
        </button>
        <button @click="deleteTodo(index)" class="text-gray-500 hover:text-gray-700 cursor-pointer" title="Delete task">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <!-- Pagination Component -->
    <div v-if="todos.length > 0" class="mt-4">
      <Pagination :pagination="pagination" @page-change="loadPage" />
    </div>
  </div>

  <TodoForm
    v-if="showForm"
    :todo="selectedTodo"
    @submit="handleSubmit"
    @close="showForm = false"
  />
</template>


<script setup>
  import { PencilSquareIcon, TrashIcon, PlusIcon, UserIcon} from '@heroicons/vue/24/solid';
  import { onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ref } from 'vue';
  import { watch } from 'vue'
  import TodoForm from '../components/TodoForm.vue';
  import Pagination from '../components/Pagination.vue';
  import SearchFilter from '../components/SearchFilter.vue';
  import { useRouter } from 'vue-router';
  import ProfileDropdown from '../components/ProfileDropdown.vue';

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
  const categoryFilter = ref('');
  const perPage = ref(10); // default value

  watch([searchQuery, statusFilter, perPage, categoryFilter], () => {
    loadPage(1);
  });

  onMounted(() => {
    store.dispatch('getTodos').then(() => {
    });
  });

  function loadPage(page) {
    console.log('Loading page:', page);
    const params = {
      page,
      search: searchQuery.value,
      completed: statusFilter.value,
      per_page: perPage.value,
      category: categoryFilter.value,
    };

    store.dispatch('getTodos', params);
  }

  function deleteTodo(index) {
    const todoId = todos.value[index].id;
    store.dispatch('deleteTodo', todoId);
  }

  function editTodo(index) {
    selectedTodo.value = todos.value[index];
    showForm.value = true;
  }

  function addTodo() {
    selectedTodo.value = null;
    showForm.value = true;
  }

  function handleSubmit(todoData) {

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

  function resetPage() {
    searchQuery.value = '';
    statusFilter.value = '';
    categoryFilter.value = '';
    loadPage(1);
  }
</script>

<template>
  <div class="w-7/10 mx-auto mt-5">
    <div class="flex justify-between items-center mb-4">
      <h1
        class="text-2xl font-bold text-center text-green-700 cursor-pointer"
        @click="resetPage()"
      >
        Todo List
      </h1>

      <!-- Profile Menu -->
      <ProfileDropdown :user="user" @logout="logout" />
    </div>

    <!-- search and filter -->
    <SearchFilter
      v-model:searchQuery="searchQuery"
      v-model:statusFilter="statusFilter"
      v-model:categoryFilter="categoryFilter"
    />

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
    
    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center items-center h-20">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <!-- Todo List Content -->
    <div v-else class="space-y-3">
      <!-- Display message if no todos -->
      <div v-if="todos.length === 0" class="text-center text-black mt-4">
        <span v-if="searchQuery || statusFilter">No results found.</span>
        <span v-else>You have no Todos yet.</span>
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
            class="form-checkbox h-5 w-5 text-green-500 flex-shrink-0 cursor-pointer"
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
          <button @click="editTodo(index)" class="text-gray-500 hover:text-gray-700 cursor-pointer pl-2" title="Edit task">
            <PencilSquareIcon class="w-5 h-5" />
          </button>
          <button @click="deleteTodo(index)" class="text-gray-500 hover:text-gray-700 cursor-pointer" title="Delete task">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- add Todo button -->
    <button @click="addTodo" class="flex font-bold cursor-pointer fixed bottom-5 right-5 px-4 py-4 pr-5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600">
      <PlusIcon class="w-6 h-6 pr-1" /> New Todo
    </button>

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


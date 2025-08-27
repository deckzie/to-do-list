<script setup>
  import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
  import { onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ref } from 'vue';
  import TodoForm from '../components/TodoForm.vue';


  const showForm = ref(false);
  const selectedTodo = ref(null);


  const store = useStore();

  const todos = computed(() => store.state.todos.data);
  const loading = computed(() => store.state.todos.loading);

  onMounted(() => {
    store.dispatch('getTodos');
  });

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
  <div class="max-w-md mx-auto mt-10 space-y-1">
    <h1 class="text-2xl font-bold text-center text-green-700 mb-6">TodoList</h1>
    <div
      v-for="(todo, index) in todos"
      :key="index"
      class="flex items-center justify-between bg-white shadow p-4 rounded-lg"
    >
      <!-- Left side: checkbox + title -->
      <div class="flex items-center space-x-3 flex-1 overflow-hidden">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleCompleted(todo)"
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
      <div class="flex space-x-1 flex-shrink-0">
        <button @click="editTodo(index)" class="text-gray-500 hover:text-gray-700" title="Edit task">
          <PencilSquareIcon class="w-5 h-5" />
        </button>
        <button @click="deleteTodo(index)" class="text-gray-500 hover:text-gray-700" title="Delete task">
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  <TodoForm
    v-if="showForm"
    :todo="selectedTodo"
    @submit="handleSubmit"
  />
</template>


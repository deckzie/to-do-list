<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['submit', 'close']);

const title = ref('');
const description = ref('');
const completed = ref(false);
const category = ref('HomeWork');

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    title.value = newTodo.title || '';
    description.value = newTodo.description || '';
    completed.value = newTodo.completed || false;
    category.value = newTodo.category || 'HomeWork';
  } else {
    title.value = '';
    description.value = '';
    completed.value = false;
    category.value = 'HomeWork';
  }
}, { immediate: true });

function handleSubmit() {
  emit('submit', {
    id: props.todo?.id,
    title: title.value,
    description: description.value,
    completed: completed.value,
    category: category.value,
  });
}
</script>
<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <textarea
        v-model="description"
        placeholder="Description"
        class="w-full p-2 pb-10 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      ></textarea>

      <div class="flex justify-between pb-4">
        <label class="flex items-center pl-1 space-x-1 text-sm">
          <input type="checkbox" v-model="completed" class="text-sm form-checkbox h-5 w-5 text-green-500" />
          <span>Completed</span>
        </label>
        
        <select v-model="category" class="px-2 justify-center py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="HomeWork">Homework</option>
          <option value="Housework">Housework</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Errands">Errands</option>
        </select>
      </div>

      <div class="flex justify-end space-x-2">
        <button @click="emit('close')" class="cursor-pointer px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="handleSubmit" :disabled="!title && !description" class="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ props.todo ? 'Update' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

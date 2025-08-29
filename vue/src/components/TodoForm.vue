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

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    title.value = newTodo.title || '';
    description.value = newTodo.description || '';
    completed.value = newTodo.completed || false;
  } else {
    title.value = '';
    description.value = '';
    completed.value = false;
  }
}, { immediate: true });

function handleSubmit() {
  emit('submit', {
    id: props.todo?.id,
    title: title.value,
    description: description.value,
    completed: completed.value,
  });
}
</script>
<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-xl font-bold mb-4">{{ props.todo ? 'Edit Todo' : 'Add Todo' }}</h2>

      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <textarea
        v-model="description"
        placeholder="Description"
        class="w-full p-2 border border-gray-300 rounded mb-4"
      ></textarea>

      <label class="flex items-center space-x-2 mb-4">
        <input type="checkbox" v-model="completed" class="form-checkbox h-5 w-5 text-green-500" />
        <span>Completed</span>
      </label>

      <div class="flex justify-end space-x-2">
        <button @click="emit('close')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="handleSubmit" :disabled="!title" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ props.todo ? 'Update' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

<!-- components/TodoForm.vue -->
<script setup>
import { ref, watch } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['submit', 'close']);

const title = ref('');
const completed = ref(false);

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    title.value = newTodo.description;
    completed.value = newTodo.completed;
  } else {
    title.value = '';
    completed.value = false;
  }
}, { immediate: true });

function handleSubmit() {
  emit('submit', {
    id: props.todo?.id,
    description: title.value,
    completed: completed.value
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
        placeholder="Enter todo description"
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <label class="flex items-center space-x-2 mb-4">
        <input type="checkbox" v-model="completed" class="form-checkbox h-5 w-5 text-green-500" />
        <span>Completed</span>
      </label>
      <div class="flex justify-end space-x-2">
        <button @click="emit('close')" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="handleSubmit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {{ props.todo ? 'Update' : 'Add' }}
        </button>
      </div>
    </div>
  </div>
</template>

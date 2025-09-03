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
        class="w-full p-2 pb-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      ></textarea>

      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 py-1">
        <div class="flex items-center w-full space-x-2 relative">
          <button
            @click="toggleCategoryDropdown"
            :class="[
              'cursor-pointer px-2 py-1 rounded-md text-xs',
              category ? 'bg-green-600 text-white font-bold' : 'bg-gray-400 text-white',
              'hover:bg-green-700'
            ]"
            title="Select Category"
            style="position: relative;"
          >
            <span>{{ selectedCategoryName || 'Add Category +' }}</span>
            <button
              v-if="category"
              @click.stop="removeCategory"
              class="cursor-pointer pl-2 "
              title="Remove Category"
            >✕</button>
          </button>
          <!-- Category Dropdown -->
          <div v-if="showAddCategory" class="absolute left-0 top-7 z-50 w-64 bg-white border border-gray-200 rounded shadow-lg">
            <div class="max-h-40 overflow-y-auto">
              <div
                v-for="cat in store.state.categories"
                :key="cat.id"
                @click="selectCategory(cat.id)"
                class="px-4 py-2 cursor-pointer hover:bg-green-100 text-xs"
                :class="{'bg-green-50 font-bold text-green-600': category === cat.id}"
              >
                {{ cat.name }}
              </div>
              <div v-if="!store.state.categories.length" class="px-4 py-2 text-gray-500">No categories yet.</div>
            </div>
            <div class="px-2 py-2 flex gap-2 items-center">
              <input
                v-model="newCategory"
                @keyup.enter="addCategory"
                type="text"
                placeholder="New category"
                class="flex-1 px-2 py-1 rounded text-xs"
              />
              <button
                @click="addCategory"
                class="cursor-pointer px-3 py-1 rounded bg-green-500 text-white text-xs"
              >Add</button>
            </div>
          </div>
        </div>

        <label class="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            v-model="completed"
            class="form-checkbox h-5 w-5 text-green-500"
          />
          <span>Completed</span>
        </label>
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

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  todo: { type: Object, default: null }
});
const emit = defineEmits(['submit', 'close']);

const title = ref('');
const description = ref('');
const completed = ref(false);
const category = ref('');
const showAddCategory = ref(false);
const newCategory = ref('');

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    title.value = newTodo.title || '';
    description.value = newTodo.description || '';
    completed.value = newTodo.completed || false;
    category.value = newTodo.category_id || '';
  } else {
    title.value = '';
    description.value = '';
    completed.value = false;
    category.value = '';
  }
}, { immediate: true });

function handleSubmit() {
  emit('submit', {
    id: props.todo?.id,
    title: title.value,
    description: description.value,
    completed: completed.value,
    category_id: category.value,
  });
}

function selectCategory(id) {
  category.value = id;
  showAddCategory.value = false;
}

function toggleCategoryDropdown() {
  showAddCategory.value = !showAddCategory.value;
}

function addCategory() {
  if (!newCategory.value.trim()) return;
  store.dispatch('addCategory', newCategory.value).then(() => {
    newCategory.value = '';
  });
}

function removeCategory() {
  category.value = '';
}

const selectedCategoryName = computed(() => {
  const cat = store.state.categories.find(c => c.id === category.value);
  return cat ? cat.name : '';
});

onMounted(() => {
  store.dispatch('getCategories');
});
</script>

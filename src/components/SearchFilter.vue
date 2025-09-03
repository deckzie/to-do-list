<template>
  <div class="flex flex-row gap-4 mb-4 w-full">
    <div class="relative w-full mt-5">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="Search by title or description..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        v-if="localSearchQuery"
        @click="clearSearch"
        class="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
    <!-- Category Filter -->
    <div class="flex flex-col w-2/5">
      <label for="categoryFilter" class="text-xs text-gray-600 mb-1">Category:</label>
      <select
        id="categoryFilter"
        v-model="localCategoryFilter"
        class="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All</option>
        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Status Filter -->
    <div class="flex flex-col w-1/5">
      <label for="statusFilter" class="pr-2 text-xs text-gray-600 mb-1">Status:</label>
      <select
        v-model="localStatusFilter"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All</option>
        <option value="1">Completed</option>
        <option value="0">Pending</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  searchQuery: String,
  statusFilter: String,
  categoryFilter: [String, Number],
});

const emit = defineEmits(['update:searchQuery', 'update:statusFilter', 'update:categoryFilter']);

const store = useStore();

const localSearchQuery = ref(props.searchQuery);
const localStatusFilter = ref(props.statusFilter);
const localCategoryFilter = ref(props.categoryFilter);

const categories = ref([]);

watch(localCategoryFilter, (newValue) => {
  emit('update:categoryFilter', newValue);
});

watch(localSearchQuery, (newValue) => {
  emit('update:searchQuery', newValue);
});

watch(localStatusFilter, (newValue) => {
  emit('update:statusFilter', newValue);
});

function clearSearch() {
  localSearchQuery.value = '';
}

onMounted(async () => {
  await store.dispatch('getCategories');
  categories.value = store.state.categories;
});

// Optionally, watch the store for changes to categories
watch(
  () => store.state.categories,
  (newCategories) => {
    categories.value = newCategories;
  }
);
</script>

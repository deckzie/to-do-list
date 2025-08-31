<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative">
    <div class="relative w-full sm:w-2/3">
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

    <select
      v-model="localStatusFilter"
      class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">All</option>
      <option value="1">Completed</option>
      <option value="0">Pending</option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  searchQuery: String,
  statusFilter: String,
});

const emit = defineEmits(['update:searchQuery', 'update:statusFilter']);

const localSearchQuery = ref(props.searchQuery);
const localStatusFilter = ref(props.statusFilter);

watch(localSearchQuery, (newValue) => {
  emit('update:searchQuery', newValue);
});

watch(localStatusFilter, (newValue) => {
  emit('update:statusFilter', newValue);
});

function clearSearch() {
  localSearchQuery.value = '';
}
</script>

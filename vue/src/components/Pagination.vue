<template>
  <div class="flex items-center justify-between p-4 bg-white border-t border-gray-200">
    <div class="text-xs text-gray-500 mb-2">
      {{ pagination.from }} to {{ pagination.to }} out of {{ pagination.total }} items
    </div>

    <nav
      class="isolate justify-end inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <!-- Previous Button -->
      <button
        @click="goToPage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
      >
        <span class="sr-only">Previous</span>
        <ChevronLeftIcon class="size-5" aria-hidden="true" />
      </button>

      <!-- Page Numbers -->
      <template v-if="!isSmallScreen">
        <template v-for="page in pageNumbers" :key="page">
          <button
            @click="goToPage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
              page === pagination.current_page
                ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'text-gray-900 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </template>
      </template>

      <!-- Next Button -->
      <button
        @click="goToPage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
      >
        <span class="sr-only">Next</span>
        <ChevronRightIcon class="size-5" aria-hidden="true" />
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  pagination: Object, // Ensure this is defined
});

const emit = defineEmits(['page-change']);

const isSmallScreen = ref(false);

onMounted(() => {
  const updateScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 640; // Adjust breakpoint as needed
  };

  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);

  // Cleanup listener on unmount
  return () => {
    window.removeEventListener('resize', updateScreenSize);
  };
});

const pageNumbers = computed(() => {
  const current = props.pagination?.current_page || 1;
  const last = props.pagination?.last_page || 1;
  const delta = 0; // Number of pages to show around current
  const range = [];
  const rangeWithDots = [];

  let left = Math.max(2, current - delta);
  let right = Math.min(last - 1, current + delta);

  // Always show first and last page
  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) {
    range.push(i);
  }
  if (right < last - 1) range.push('...');
  if (last > 1) range.push(last);

  return range;
});

function goToPage(page) {
  if (page >= 1 && page <= props.pagination?.last_page) {
    emit('page-change', page);
  }
}
</script>

<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      class="cursor-pointer flex text-gray-500 pr-4 pl-3 py-2 rounded-lg hover:bg-gray-100"
    >
      <UserIcon class="w-5 h-5 mt-0.5 mr-1 text-gray-500" />{{ user.name }}
    </button>

    <!-- Profile Dropdown -->
    <div
      v-if="showMenu"
      class="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md z-50 p-4 w-48"
    >
      <!-- User Info -->
      <div class="mb-4">
        <p class="text-sm font-bold text-gray-700">{{ user.name }}</p>
        <p class="text-sm text-gray-500">{{ user.email }}</p>
      </div>

      <!-- Log Out Button -->
      <button
        @click="logout"
        class="cursor-pointer block w-full py-2 text-sm text-left text-red-600 hover:bg-gray-100"
      >
        Log Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UserIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['logout']);

const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  emit('logout');
  showMenu.value = false;
}
</script>
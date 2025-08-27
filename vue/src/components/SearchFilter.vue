<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
    <input
    :value="searchQuery"
    @input="event => emit('update:searchQuery', event.target.value)"
    type="text"
    placeholder="Search..."
    class="..."
    />

    <select
    :value="statusFilter"
    @change="event => emit('update:statusFilter', event.target.value)"
    class="..."
    >
    <option value="">All</option>
    <option value="true">Completed</option>
    <option value="false">Pending</option>
    </select>

  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  searchQuery: String,
  statusFilter: String
});

const emit = defineEmits(['update:searchQuery', 'update:statusFilter']);
</script>

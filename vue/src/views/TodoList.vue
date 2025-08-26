<script setup>
import { onMounted, ref } from 'vue';
import axiosClient from '../axios';

const todos = ref([]);

onMounted(async () => {
  const res = await axiosClient.get('/todos');
  todos.value = res.data.data;
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-2">Todo List</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id" class="mb-1">
        <span :class="{ 'line-through': todo.completed }">{{ todo.title }}</span>
      </li>
    </ul>
  </div>
</template>

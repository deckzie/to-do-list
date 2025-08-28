<script setup>
import { ref } from 'vue';
import axiosClient from '../axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const store = useStore();

async function login() {
  try {
    await store.dispatch('loginUser', {
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err) {
    error.value = 'Invalid credentials';
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h2 class="text-xl font-bold mb-4">Login</h2>
    <input v-model="email" type="email" placeholder="Email" class="w-full mb-2 p-2 border rounded" />
    <input v-model="password" type="password" placeholder="Password" class="w-full mb-2 p-2 border rounded" />
    <button @click="login" class="w-full bg-green-600 text-white py-2 rounded">Login</button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p class="mt-4 text-center">
      Don't have an account? <router-link to="/signup" class="text-green-600">Sign Up</router-link>
    </p>
  </div>
</template>

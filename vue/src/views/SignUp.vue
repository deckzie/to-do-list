<script setup>
import { ref } from 'vue';
import axiosClient from '../axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const store = useStore();

async function signUp() {
  try {
    await store.dispatch('registerUser', {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err) {
    error.value = 'Sign up failed';
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h2 class="text-xl font-bold mb-4">Sign Up</h2>
    <input v-model="name" type="text" placeholder="Name" class="w-full mb-2 p-2 border rounded" />
    <input v-model="email" type="email" placeholder="Email" class="w-full mb-2 p-2 border rounded" />
    <input v-model="password" type="password" placeholder="Password" class="w-full mb-2 p-2 border rounded" />
    <button @click="signUp" class="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import AuthForm from '../components/AuthForm.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

function registerUser({ name, email, password }) {
  return store.dispatch('registerUser', { name, email, password });
}
</script>

<template>
  <AuthForm
    title="Sign Up"
    :fields="[
      { model: 'name', type: 'text', placeholder: 'Name' },
      { model: 'email', type: 'email', placeholder: 'Email' },
      { model: 'password', type: 'password', placeholder: 'Password' }
    ]"
    action-label="Sign Up"
    error-message="Sign up failed"
    :on-submit="registerUser"
  />
  <p class="text-center mt-4">
    Already have an account? <router-link to="/login" class="text-blue-500">Log in</router-link>
  </p>
</template>

<script setup>
import AuthForm from '../components/AuthForm.vue';
import { useStore } from 'vuex';

const store = useStore();

function loginUser({ email, password }) {
  return store.dispatch('loginUser', { email, password });
}
</script>

<template>
  <AuthForm
    title="Login"
    :fields="[
      { model: 'email', type: 'email', placeholder: 'Email' },
      { model: 'password', type: 'password', placeholder: 'Password' }
    ]"
    action-label="Login"
    error-message="Invalid credentials"
    :on-submit="loginUser"
    :link="{ text: 'Don\'t have an account?', to: '/signup', label: 'Sign Up' }"
  />
</template>

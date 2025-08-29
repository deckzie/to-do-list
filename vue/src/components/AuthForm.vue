<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  fields: Array, // e.g. [{ model: 'email', type: 'email', placeholder: 'Email' }]
  actionLabel: String,
  errorMessage: String,
  onSubmit: Function,
  link: {
    type: Object,
    default: null, // e.g. { text: "Don't have an account?", to: "/signup", label: "Sign Up" }
  },
});

const formState = ref({});
const error = ref('');
const router = useRouter();
const store = useStore();

function updateField(model, value) {
  formState.value[model] = value;
}

async function handleSubmit() {
  try {
    await props.onSubmit(formState.value);
    router.push('/');
  } catch (err) {
    error.value = props.errorMessage;
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-10">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    <div v-for="field in fields" :key="field.model">
      <input
        :type="field.type"
        :placeholder="field.placeholder"
        class="w-full mb-2 p-2 border rounded"
        v-model="formState[field.model]"
      />
    </div>
    <button @click="handleSubmit" class="w-full bg-green-600 text-white py-2 rounded">
      {{ actionLabel }}
    </button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="link" class="mt-4 text-center">
      {{ link.text }} <router-link :to="link.to" class="text-green-600">{{ link.label }}</router-link>
    </p>
  </div>
</template>

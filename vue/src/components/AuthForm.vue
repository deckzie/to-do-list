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
const validationErrors = ref({});

function validateField(model, value) {
  if (model === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validationErrors.value.email = !emailRegex.test(value)
      ? 'Please enter a valid email address.'
      : '';
  }

  if (model === 'password') {
    validationErrors.value.password = value.length < 8
      ? 'Password must be at least 8 characters.'
      : '';
  }
}

function updateField(model, value) {
  formState.value[model] = value;
  validateField(model, value);
}

function hasValidationErrors() {
  return Object.values(validationErrors.value).some(error => error);
}

async function handleSubmit() {
  if (hasValidationErrors()) {
    error.value = 'Please fix the errors before submitting.';
    return;
  }

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
    <!-- <div v-for="field in fields" :key="field.model">
      <input
        :type="field.type"
        :placeholder="field.placeholder"
        class="w-full mb-2 p-2 border rounded"
        v-model="formState[field.model]"
      />
    </div> -->

    <div v-for="field in fields" :key="field.model" class="mb-4">
    <input
        :type="field.type"
        :placeholder="field.placeholder"
        class="w-full p-2 border rounded"
        :class="{ 'border-red-500': validationErrors[field.model] }"
        :value="formState[field.model] || ''"
        @input="updateField(field.model, $event.target.value)"
    />
    <p v-if="validationErrors[field.model]" class="text-red-500 text-sm mt-1">
        {{ validationErrors[field.model] }}
    </p>
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

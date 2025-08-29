<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineProps } from 'vue';
import axiosClient from '../axios'; // or wherever your axios instance lives
import { debounce } from 'lodash';

const validationErrors = ref({});
const emailTaken = ref(false);

const checkEmailAvailability = debounce(async (email) => {
  try {
    const response = await axiosClient.post('/check-email', { email });
    emailTaken.value = response.data.exists;
    validationErrors.value.email = emailTaken.value
      ? 'This email is already taken.'
      : '';
  } catch (err) {
    console.error('Error checking email:', err);
  }
}, 500);


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
  checkEmail: {
    type: Boolean,
    default: false, // Only enable email check when explicitly set
  },
});

const formState = ref({});
const error = ref('');
const router = useRouter();
const store = useStore();

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
  validationErrors.value[model] = ''; // Clear the error for the field being updated

  if (error.value) {
    error.value = ''; // Clear the general error message
  }

  if (props.checkEmail) {
      validateField(model, value);
      if (model === 'email' && !validationErrors.value.email) {
          checkEmailAvailability(value);
      }
  }
}

function hasValidationErrors() {
  return Object.values(validationErrors.value).some(error => error);
}

function hasEmptyFields() {
  return !formState.value.email || !formState.value.password;
}

async function handleSubmit() {
  if (hasEmptyFields()) {
    error.value = 'Please fill in both email and password.';
    return;
  }

  try {
    console.log("try")
    await props.onSubmit(formState.value);
    console.log("submit")

    router.push('/');
    console.log("push")
  } catch (err) {
            console.log("catch")

    if (err.response?.data?.field && err.response?.data?.message) {
      validationErrors.value[err.response.data.field] = err.response.data.message;
        console.log("if")
    } else if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log("else if")

        const errors = err.response.data.errors;
        for (const field in errors) {
            validationErrors.value[field] = errors[field][0];
        }
    }
    else {
                console.log("else")

      error.value = props.errorMessage;
    }
  }
}


</script>

<template>
  <div class="max-w-sm mx-auto mt-50">
    <h2 class="text-xl font-bold mb-4 text-center text-green-600">{{ title }}</h2>

    <div v-for="field in fields" :key="field.model" class="mb-4">
    <input
        :type="field.type"
        :placeholder="field.placeholder"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        :class="{ 'border-red-500': validationErrors[field.model] }"
        :value="formState[field.model] || ''"
        @input="updateField(field.model, $event.target.value)"
    />
    <p v-if="validationErrors[field.model]" class="text-red-500 text-sm mt-1">
        {{ validationErrors[field.model] }}
    </p>
    </div>


    <button @click="handleSubmit" class="w-full bg-green-600 text-white py-2 rounded cursor-pointer">
      {{ actionLabel }}
    </button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="link" class="mt-4 text-center">
      {{ link.text }} <router-link :to="link.to" class="text-green-600">{{ link.label }}</router-link>
    </p>
  </div>
</template>

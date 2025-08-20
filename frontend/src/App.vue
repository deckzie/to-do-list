<script setup>
import { ref, onMounted, watch } from 'vue'
import api from './lib/api'

const todos = ref([])
const meta = ref(null)

const page = ref(1)
const perPage = ref(10)
const status = ref('')       // '', 'pending', 'done'
const search = ref('')

const form = ref({ id:null, title:'', description:'', status:'pending', due_date:'' })
const loading = ref(false)

async function fetchTodos() {
  loading.value = true
  try {
    const { data } = await api.get('/todos', {
      params: {
        page: page.value,
        per_page: perPage.value,
        status: status.value || undefined,
        search: search.value || undefined,
      }
    })
    todos.value = data.data
    meta.value = data.meta
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = { id:null, title:'', description:'', status:'pending', due_date:'' }
}

async function submitForm() {
  if (form.value.id) {
    await api.put(`/todos/${form.value.id}`, {
      title: form.value.title,
      description: form.value.description || null,
      status: form.value.status,
      due_date: form.value.due_date || null,
    })
  } else {
    await api.post('/todos', {
      title: form.value.title,
      description: form.value.description || null,
      status: form.value.status,
      due_date: form.value.due_date || null,
    })
  }
  resetForm()
  await fetchTodos()
}

async function editRow(row) {
  form.value = { ...row, due_date: row.due_date ?? '' }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteRow(id) {
  if (!confirm('Delete this todo?')) return
  await api.delete(`/todos/${id}`)
  await fetchTodos()
}

watch([page, perPage], fetchTodos)
onMounted(fetchTodos)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold">To-do List</h1>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-2xl shadow flex flex-wrap gap-3 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium">Search</label>
          <input v-model="search" @keyup.enter="page=1; fetchTodos()"
                 class="w-full border rounded-xl px-3 py-2" placeholder="Keyword..." />
        </div>
        <div>
          <label class="block text-sm font-medium">Status</label>
          <select v-model="status" class="border rounded-xl px-3 py-2">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Per Page</label>
          <select v-model.number="perPage" class="border rounded-xl px-3 py-2">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
          </select>
        </div>
        <button @click="page=1; fetchTodos()" class="px-4 py-2 rounded-2xl bg-black text-white">
          Apply
        </button>
      </div>

      <!-- Form -->
      <div class="bg-white p-4 rounded-2xl shadow space-y-3">
        <h2 class="font-semibold">{{ form.id ? 'Edit To-do' : 'New To-do' }}</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <input v-model="form.title" placeholder="Title" class="border rounded-xl px-3 py-2"/>
          <select v-model="form.status" class="border rounded-xl px-3 py-2">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <input v-model="form.due_date" type="date" class="border rounded-xl px-3 py-2"/>
          <input v-model="form.description" placeholder="Description (optional)" class="border rounded-xl px-3 py-2"/>
        </div>
        <div class="flex gap-2">
          <button @click="submitForm" class="px-4 py-2 rounded-2xl bg-blue-600 text-white">
            {{ form.id ? 'Update' : 'Create' }}
          </button>
          <button @click="resetForm" class="px-4 py-2 rounded-2xl border">Clear</button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow overflow-auto">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-sm">
            <tr>
              <th class="text-left p-3">Title</th>
              <th class="text-left p-3">Status</th>
              <th class="text-left p-3">Due</th>
              <th class="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in todos" :key="t.id" class="border-t">
              <td class="p-3">{{ t.title }}</td>
              <td class="p-3 capitalize">{{ t.status }}</td>
              <td class="p-3">{{ t.due_date ?? '—' }}</td>
              <td class="p-3 flex gap-2">
                <button @click="editRow(t)" class="px-3 py-1 rounded-xl border">Edit</button>
                <button @click="deleteRow(t.id)" class="px-3 py-1 rounded-xl bg-red-600 text-white">Delete</button>
              </td>
            </tr>
            <tr v-if="!loading && todos.length===0">
              <td colspan="4" class="p-6 text-center text-gray-500">No results</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta" class="flex items-center gap-3">
        <button :disabled="!meta.links.prev" @click="page--;"
                class="px-3 py-1 rounded-xl border disabled:opacity-50">Prev</button>
        <div>Page {{ meta.current_page }} / {{ meta.last_page }}</div>
        <button :disabled="!meta.links.next" @click="page++;"
                class="px-3 py-1 rounded-xl border disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

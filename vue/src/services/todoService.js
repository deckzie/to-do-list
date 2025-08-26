import axiosClient from '../axios'

export function getTodos() {
  return axiosClient.get('/todos')
}

export function createTodo(data) {
  return axiosClient.post('/todos', data)
}

export function updateTodo(id, data) {
  return axiosClient.put(`/todos/${id}`, data)
}

export function deleteTodo(id) {
  return axiosClient.delete(`/todos/${id}`)
}

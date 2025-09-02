import axiosClient from './axios'

export function getUsers() {
  return axiosClient.get('/users')
}

export function getUser(id) {
  return axiosClient.get(`/users/${id}`)
}

export function updateUser(id, data) {
  return axiosClient.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  return axiosClient.delete(`/users/${id}`)
}

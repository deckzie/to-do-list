import {createStore} from "vuex";
import axiosClient from "../axios";

const store = createStore({
    state: {
        user: null,
        todos: {
            data: [],
            meta: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            links: [],
            from: 1,
            to: 10
            },
            loading: false
        }
    },
    getters: {},
    actions: {
        async registerUser({ commit }, userData) {
            try {
                const response = await axiosClient.post('/users', userData);
                // Assuming the backend returns the created user directly
                localStorage.setItem('user', JSON.stringify(response.data));
                commit('setUser', response.data);

                // Automatically log in the user after registration
                const loginResponse = await axiosClient.post('/login', {
                    email: userData.email,
                    password: userData.password
                });
                localStorage.setItem('token', loginResponse.data.token);
                commit('setUser', loginResponse.data.user);
            } catch (error) {
                console.error("Error registering user:", error);
                throw error; // Re-throw the error to handle it in the component
            }
        },
        async loginUser({ commit }, credentials) {
            try {
                const response = await axiosClient.post('/login', credentials);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                commit('setUser', response.data.user);
            } catch (error) {
                console.error("Error logging in user:", error);
                throw error;
            }
        },
        async getTodo({commit}, todoId) {
            commit('setLoading', true);
            try {
                const response = await axiosClient.get(`/todos/${todoId}`);
                commit('setTodo', response.data);
            } catch (error) {
                console.error("Error fetching todo:", error);
            } finally {
                commit('setLoading', false);
            }
        },
        async getTodos({ commit }, params = { page: 1 }) {
            commit('setLoading', true);
            try {
                const response = await axiosClient.get('/todos', { params });
                commit('setTodos', {
                data: response.data.data,
                meta: {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                    links: response.data.links,
                    from: response.data.from,
                    to: response.data.to
                }
                });
            } catch (error) {
                console.error("Error fetching todos:", error);
            } finally {
                commit('setLoading', false);
            }
        },
        saveTodo({commit}, todo) {
            commit('setLoading', true);
            axiosClient.post('/todos', todo)
                .then(response => {
                    commit('addTodo', response.data);
                })
                .catch(error => {
                    console.error("Error saving todo:", error);
                })
                .finally(() => {
                    commit('setLoading', false);
                });
        },
        deleteTodo({commit}, todoId) {
            commit('setLoading', true);
            axiosClient.delete(`/todos/${todoId}`)
                .then(() => {
                    commit('removeTodo', todoId);
                })
                .catch(error => {
                    console.error("Error deleting todo:", error);
                })
                .finally(() => {
                    commit('setLoading', false);
                });
        },
        addTodo({ commit }, todoData) {
            axiosClient.post('/todos', todoData)
                .then(({ data }) => {
                    commit('addTodo', data);
                });
        },

        updateTodo({ commit }, todoData) {
            axiosClient.put(`/todos/${todoData.id}`, todoData)
                .then(({ data }) => {
                    commit('updateTodo', data);
                });
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setLoading(state, loading) {
            state.todos.loading = loading;
        },
        setTodo(state, todo) {
            const index = state.todos.data.findIndex(t => t.id === todo.id);
            if (index !== -1) {
                state.todos.data.splice(index, 1, todo);
            }
        },
        setTodos(state, { data, meta }) {
            state.todos.data = data;
            state.todos.meta = {
                current_page: meta.current_page,
                last_page: meta.last_page,
                per_page: meta.per_page,
                total: meta.total,
                links: meta.links,
                from: meta.from,
                to: meta.to
            };
        },
        removeTodo(state, todoId) {
            state.todos.data = state.todos.data.filter(todo => todo.id !== todoId);
        },
        addTodo(state, todo) {
            state.todos.data.push(todo);
        },
        updateTodo(state, updated) {
            if (!updated || !updated.id) return;

            const index = state.todos.data.findIndex(t => t.id === updated.id);
            if (index !== -1) state.todos.data[index] = updated;
        }
    },
    modules: {}

});

export default store;
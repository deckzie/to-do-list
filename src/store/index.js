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
        },
        categories: [] // <-- add this
    },
    getters: {},
    actions: {
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
        async deleteTodo({commit, dispatch }, todoId) {
            commit('setLoading', true);
            try {
                await axiosClient.delete(`/todos/${todoId}`);
                await dispatch('getTodos'); // re-fetch updated list and pagination
            } catch (error) {
                console.error("Error deleting todo:", error);
            }
            commit('setLoading', false);
        },
        async addTodo({commit, dispatch }, todoData) {
            commit('setLoading', true);
            try {
                await axiosClient.post('/todos', todoData);
                await dispatch('getTodos'); // re-fetch updated list and pagination
            } catch (error) {
                console.error("Error adding todo:", error);
            }
            commit('setLoading', false);
        },
        updateTodo({ commit }, todoData) {
            commit('setLoading', true);
            axiosClient.put(`/todos/${todoData.id}`, todoData)
                .then(({ data }) => {
                    commit('updateTodo', data);
                })
                .catch(error => {
                    console.error("Error updating todo:", error);
                })
                .finally(() => {
                    commit('setLoading', false);
                });
        },
        async getCategories({ commit }) {
            try {
                const res = await axiosClient.get('/categories');
                commit('setCategories', res.data);
            } catch (e) {
                commit('setCategories', []);
            }
        },
        async addCategory({ dispatch }, categoryName) {
            try {
                await axiosClient.post('/categories', { name: categoryName });
                dispatch('getCategories'); // refresh categories after adding
            } catch (e) {
                commit('setCategories', []);
            }
        },
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
        },
        setCategories(state, categories) {
            state.categories = categories;
        },
    },
    modules: {}

});

export default store;
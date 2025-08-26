import {createStore} from "vuex";
import axiosClient from "../axios";

const store = createStore({
    state: {
        user: {
            id: null,
            name: '',
            email: ''
        },
        todos:{
            loading: false,
            data: []
        },
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
        async getTodos({commit}) {
            commit('setLoading', true);
            try {
                const response = await axiosClient.get('/todos');
                commit('setTodos', response.data);
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
    },
    mutations: {
        setLoading(state, loading) {
            state.todos.loading = loading;
        },
        setTodo(state, todo) {
            const index = state.todos.data.findIndex(t => t.id === todo.id);
            if (index !== -1) {
                state.todos.data.splice(index, 1, todo);
            }
        },
        setTodos(state, todos) {
            debugger;
            state.todos = todos;
        },
        addTodo(state, todo) {
            state.todos.data.push(todo);
        },
        removeTodo(state, todoId) {
            state.todos.data = state.todos.data.filter(todo => todo.id !== todoId);
        },
    },
    modules: {}

});

export default store;
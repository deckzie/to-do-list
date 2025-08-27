import {createRouter, createWebHistory} from "vue-router";
// import TodoList from '../views/TodoList.vue'
const routes = [
    {
      path: '/',
      name: 'To Do List',
      component: () => import('../views/TodoList.vue')
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

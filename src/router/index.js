import {createRouter, createWebHistory} from "vue-router";

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

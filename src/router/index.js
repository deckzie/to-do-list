import {createRouter, createWebHistory} from "vue-router";
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';

const routes = [
    {
      path: '/',
      name: 'To Do List',
      component: () => import('../views/TodoList.vue')
    },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // },
    // {
    //   path: '/signup',
    //   name: 'Sign Up',
    //   component: SignUp
    // },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// router.beforeEach((to, from, next) => {
//   const user = localStorage.getItem('user');
//   if (user && (to.path === '/login' || to.path === '/signup')) {
//     next('/');
//   } else if (!user && to.path !== '/login' && to.path !== '/signup') {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;

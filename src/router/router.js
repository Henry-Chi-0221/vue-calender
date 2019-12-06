import login from './components/login.vue';
import HelloWorld from './components/HelloWorld.vue';

export const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: HelloWorld
  }
];
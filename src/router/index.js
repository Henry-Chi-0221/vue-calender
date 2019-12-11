import Vue from 'vue'
import VueRouter from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import login from '../components/login.vue'
import header from '../components/header.vue'
import user from '../components/user.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
    
  {
    path: '/',
    name: 'HelloWorld',
    components: {
        default:HelloWorld,
          nav  :header
    }
  },
    
  {
    path: '/user',
    name: 'user',
    components: {
        default:user,
        nav    :header
    }, 
  },
  {
      path: '*',
      redirect: '/',
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router

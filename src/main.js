import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import VueRouter from 'vue-router';
import { routes } from './routes'
Vue.config.productionTip = false

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

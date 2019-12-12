import Vue from "vue";
import "./plugins/fontawesome";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueRouter from "vue-router";
import Axios from "axios";
Vue.config.productionTip = false;
//Vue.use(VueRouter);

Axios.defaults.baseURL = "http://localhost";
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem("token") == "ImLogin";
  if (isLogin) {
    next();
  } else {
    if (to.path !== "/login") next("/login");
    else next();
  }
});

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");

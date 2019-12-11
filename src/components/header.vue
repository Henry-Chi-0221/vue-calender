<template>
  <transition name="fade">
    <!--
        <router-link to="/">Home</router-link>
        <router-link to="/user">User</router-link>
        <a href="" @click.prevent="logout">Logout</a>
    -->
    <v-app-bar app color="#5165a3" dark>
      <div class="d-flex align-center">
        <v-btn icon color="#5165a3">
          <v-icon color="white">far fa-calendar</v-icon>
        </v-btn>
        <v-btn small depressed color="#5165a3">calendar</v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-avatar style="marginRight:15px" size="36" color="#d996cc">
        <v-menu v-model="user_toggle" :close-on-content-click="false" offset-y offset-x>
          <template v-slot:activator="{ on }">
            <v-btn icon text @click="user_toggle = true" v-on="on">
              <span class="white--text">CJ</span>
            </v-btn>
          </template>

          <v-card class="mx-auto" max-width="400">
            <v-img
              class="white--text align-end"
              height="200px"
              width="300px"
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-container fluid style="height: 100%;">
                <v-layout row justify-center align-center style=" height: 100%">
                  <v-flex shrink>
                    <v-avatar size="72" color="#d996cc" style="marginBottom:60px">
                      <span class="white--text">CJ</span>
                    </v-avatar>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>

            <v-card-title class="pb-0">CJ</v-card-title>

            <v-card-text class="text--primary">
              <div>歡迎回來</div>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn color="red" text @click="logout()" block>Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-avatar>
    </v-app-bar>
  </transition>
</template>

<script>
export default {
  data: () => {
    return {
      user_toggle: false
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>
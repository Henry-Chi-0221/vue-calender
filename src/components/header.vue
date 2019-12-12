<template>
  <div>
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
                <span class="white--text">{{userName}}</span>
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
                        <span class="white--text">{{userName}}</span>
                      </v-avatar>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-img>

              <v-card-title class="pb-0">{{userName}}</v-card-title>

              <v-card-text class="text--primary">
                <div>歡迎使用本系統,您可以</div>
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn color="red" text @click="openModifyDialog()">修改個人資料</v-btn>
                <v-btn color="red" text @click="logout()">登出</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-avatar>
      </v-app-bar>
    </transition>
    <v-row justify="center">
      <v-dialog v-model="modifyDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">修改資料</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="modifyName" label="帳號名稱" :rules="modifyNameRules" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="modifyEmail"
                    label="電子郵件"
                    :rules="modifyEmailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="modifyPass"
                    label="密碼"
                    type="password"
                    :rules="modifyPassRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="modifyDialog=false">取消</v-btn>
            <v-btn color="blue darken-1" text @click="modify()">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data: () => {
    return {
      modifyDialog: false,
      modifyName: "",
      modifyPass: "",
      modifyEmail: "",
      modifyNameRules: [v => !!v || "請輸入使用者帳號"],
      modifyPassRules: [v => !!v || "請輸入使用者密碼"],
      modifyEmailRules: [v => !!v || "請輸入使用者信箱"],
      user_toggle: false,
      userName: localStorage.getItem("username")
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    openModifyDialog() {
      this.modifyDialog = true;
      this.getModify();
    },
    getModify() {
      axios
        .post("/api/getModify", {
          userName: localStorage.getItem("username")
        })
        .then(response => {
          this.modifyName = response.data.name;
          this.modifyPass = response.data.password;
          this.modifyEmail = response.data.email;
          console.log(response.data);
        })
        .catch(response => {
          console.log(error);
        });
      //console.log(this.selectedEvent);
    },
    modify() {
      console.log(this.modifyPass);
      axios
        .post("/api/modify", {
          userName: localStorage.getItem("username"),
          userPassword: this.modifyPass,
          userEmail: this.modifyEmail
        })
        .then(response => {
          console.log(response.data);
          this.modifyDialog = false;
        })
        .catch(error => {
          console.log(error);
        });
      //console.log(this.selectedEvent);
    }
  }
};
</script>
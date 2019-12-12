<template>
  <transition name="fade">
    <v-container fluid style="height: 100vh;" class="bgc">
      <v-layout row justify-center align-center style=" height: 100%">
        <v-flex shrink>
          <v-card min-width="350px" max-width="450px">
            <v-card-text>
              <div>紀錄生活中的一切...</div>
              <v-divider />
              <p />
              <p class="display-2 text--primary">登入</p>
              <p>行事曆</p>
            </v-card-text>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="username"
                      :rules="usernameRules"
                      label="使用者名稱"
                      :error="errorName"
                      :error-messages="error_messages[0]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      label="使用者密碼"
                      type="password"
                      :error="errorPass"
                      :error-messages="error_messages[1]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text icon color="primary" @click="joinDialog=true">
                  註冊
                  <v-icon small>fas fa-user-plus</v-icon>
                </v-btn>
                <v-btn text icon color="primary" @click="login()">
                  登入
                  <v-icon small>fas fa-sign-in-alt</v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>

      <v-row justify="center">
        <v-dialog v-model="joinDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">註冊帳號</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="joinName" label="帳號名稱" :rules="joinNameRules" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="joinEmail" label="電子郵件" :rules="joinEmailRules" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="joinPass"
                      label="密碼"
                      type="password"
                      :rules="joinPassRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="joinDialog=false">取消</v-btn>
              <v-btn color="blue darken-1" text @click="join()">註冊</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </transition>
</template>
<style>
.bgc {
  background-color: #5165a3;
}
</style>
<script>
const axios = require("axios");
export default {
  name: "login",
  data() {
    return {
      joinDialog: false,
      email: "",
      password: "",
      valid: false,

      joinName: "",
      joinPass: "",
      joinEmail: "",

      passwordRules: [
        v => !!v || "請輸入使用者密碼",
        v => v.length <= 20 || "Name must be less than 10 characters"
      ],
      username: "",
      usernameRules: [v => !!v || "請輸入使用者帳號"],
      joinNameRules: [v => !!v || "請輸入使用者帳號"],
      joinPassRules: [v => !!v || "請輸入使用者密碼"],
      joinEmailRules: [v => !!v || "請輸入使用者信箱"],
      error_messages: [],
      errorPass: false,
      errorName: false
    };
  },
  methods: {
    login() {
      axios
        .post("/api/loginCheck", {
          userName: this.username,
          userPassword: this.password
        })
        .then(response => {
          localStorage.setItem("token", "ImLogin");
          localStorage.setItem("username", this.username);
          this.error = false;
          this.$router.push("/");
        })
        .catch(error => {
          if (error.response.data == "Wrong UserName") {
            this.error_messages[0] = "帳號不正確";
            this.errorName = true;
          }
          if (error.response.data == "Wrong Password!") {
            this.errorName = false;
            this.error_messages[0] = "";
            this.error_messages[1] = "密碼不正確";
            this.errorPass = true;
          }
        });
    },
    join() {
      axios
        .post("/api/addUser", {
          userName: this.joinName,
          userPassword: this.joinPass,
          userEmail: this.joinEmail
        })
        .then(response => {
          this.joinDialog = false;
        })
        .catch(response => {
          console.log(error);
        });
    }
  },
  computed: {},

  mounted() {
    this.error = false;
  }
};
</script>
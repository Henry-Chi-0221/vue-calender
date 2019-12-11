<template>
    <transition name="fade">
        <v-container fluid style="height: 100vh;" class="bgc">
            <v-layout row justify-center align-center style=" height: 100%"> 
                <v-flex shrink>
                    <v-card min-width="350px" max-width="450px">
                        <v-card-text>
                            <div>Record of the Day</div>
                            <p class="display-1 text--primary">
                                Login
                            </p>
                            <p>V-Calendar</p>
                        </v-card-text>
                        <v-form v-model="valid">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="email" :rules="emailRules" label="E-mail" :error="error" :error-messages="error_messages[0]" required></v-text-field>
                                    </v-col>
                                </v-row> 
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="password" :rules="nameRules" label="password" type="password" :error="error" :error-messages="error_messages[1]" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-spacer></v-spacer>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text icon color="primary" @click="login()">
                                    Submit
                                    <v-icon small>far fa-paper-plane</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </transition>
</template>
<style>
    .bgc{
        background-color: #5165a3;
    }
</style>
<script>
    const axios = require('axios');
    export default {
    name: 'login',
    data () {
          return {
            email: '',
            password: '',
            valid: false,
            error: false,
            nameRules: [
                v => !!v || 'password is required',
                v => v.length <= 20 || 'Name must be less than 10 characters',
              ],
              email: '',
              emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
              ]
            }
        },
        methods: {
          login(){
//write login authencation logic here!
              var vm = this;
              axios.post('/loginCheck', {
                username: vm.email,
                password: vm.password
              })
              .then(function (response) {
                localStorage.setItem('token', 'ImLogin');
                vm.error = false;
                vm.$router.push('/');
              })
              .catch(function (error) {
                vm.error = true;
                console.log(error);
              });
              
              /*
                if( this.email == 'm951406@gmail.com' && this.password == '12342234' ){
                  localStorage.setItem('token', 'ImLogin');
                  this.error = false;
                  this.$router.push('/');
                } else{
                  this.error = true
                }
              */
              }
        },
        computed : {
            error_messages () {
                if(this.error == true){
                    return [
                          "E-mail is incorrect",
                          "password is incorrect"
                      ]
                }
                else return []
            }
        },
        
        mounted () {
            this.error = false;
        }
    }
</script>
<template>
 
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
          <v-icon>calendar</v-icon>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        target="_blank"
        text
      >
        <span class="mr-2"></span>
        <v-icon>fas fa-lock</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>

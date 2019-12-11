<template>
  <v-app>
    <v-content>
    <!--  <HelloWorld/> -->
      <router-view name="nav"></router-view>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

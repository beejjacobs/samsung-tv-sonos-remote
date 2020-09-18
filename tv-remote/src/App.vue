<template>
  <v-app>
    <v-main>
      <controls/>
    </v-main>
  </v-app>
</template>

<script>
import Controls from './components/Controls';

export default {
  name: 'App',
  components: {
    Controls,
  }
};
</script>

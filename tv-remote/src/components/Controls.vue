<template>
  <v-container>
    <v-btn @click="source">Source</v-btn>
    <v-btn @click="menu">Menu</v-btn>
    <v-btn @click="back">Back</v-btn>
  </v-container>
</template>

<script>
import SamsungRemote from '@/samsung-tv';

const samsungTv = new SamsungRemote({ip: '192.168.0.102'});

export default {
  name: 'Controls',
  methods: {
    source() {
      console.log('source');
      samsungTv.source();
    },
    menu() {
      console.log('menu');
      samsungTv.menu();
    },
    back() {
      console.log('back');
      samsungTv.back();
    }
  }
}
</script>

import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

function onDeviceReady() {
  console.log('onDeviceReady');
  new Vue({
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}

document.addEventListener('deviceready', onDeviceReady);

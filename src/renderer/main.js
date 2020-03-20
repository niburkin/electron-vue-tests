import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import globals from './store/globals'
console.log(process.env)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  data: globals,
  mounted () {
    document.addEventListener('keydown', (keyCode) => {
      const key = keyCode.key.toLowerCase()

      const event = new Event('key:click')
      event.key = key
      document.dispatchEvent(event)
    })
  },
  template: '<App/>'
}).$mount('#app')

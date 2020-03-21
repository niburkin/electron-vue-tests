import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import globals from './store/globals'
import {execFile} from 'child_process'

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

      if (key === 'j') {
        this.$router.push({name: 'main'})
      }

      const event = new Event('key:click')
      event.key = key
      document.dispatchEvent(event)
    })
  },
  methods: {
    clamp (value, min, max) {
      return Math.min(Math.max(value, min), max)
    },
    setSelected (object) {
      this.selected = object
      const event = new Event('selected:item')
      event.object = object
      document.dispatchEvent(event)
    },
    useObject (block) {
      switch (block.type) {
        case 'command':
          if (block.command) {
            this.runCommand(block.command, block.parameters)
          }
          break
        case 'url':
          if (block.url) {
            const BrowserWindow = this.$electron.remote.BrowserWindow
            let win = new BrowserWindow({
              parent: this.$electron.remote.getCurrentWindow(),
              show: false,
              width: 1000,
              height: 500,
              fullscreen: true,
              frame: false,
              webPreferences: {
                preload: require('path').join(__dirname, '../../main/preload.js')
              }
            })
            win.loadURL(block.url, {
              userAgent: 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chr0me/38.0.2125.122 Safari/537.36 LG Browser/8.00.00(LGE; 60UH6550-UB; 03.00.15; 1; DTV_W16N); webOS.TV-2016; LG NetCast.TV-2013 Compatible (LGE, 60UH6550-UB, wireless)'
            })
            win.once('ready-to-show', () => {
              win.show()
            })
            win.on('closed', () => {
              win = null
            })
            // this.$electron.remote.getCurrentWindow().loadURL(block.url)
          }
          break
        case 'router':
          this.$router.push({name: 'games-page'})
          break
      }
    },
    runCommand (command, parameters) {
      // const command = 'C:\\Program Files (x86)\\BambukTV\\IpTvPlayer.exe'
      // const parameters = []
      execFile(command, parameters, function (err, data) {
        console.log(err)
        console.log(data.toString())
      }).on('close', function () {
        console.log('Closed')
      }).on('error', function () {
        console.log('Error')
      })
    }
  },
  template: '<App/>'
}).$mount('#app')

<template>
    <div id="wrapper">
        <div class="header">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-3"></div>
                <div class="col-md-3"></div>
                <div class="col-md-3" id="clock">
                    <div class="time">12:12</div>
                    <div class="year">12 monday 13</div>
                </div>
            </div>
        </div>
        <div class="content">

            <div class="main-row" v-for="block in blocks">
                <div class="row">
                    <block-item v-bind:item="children" v-for="children in block.children"
                                v-bind:classes="children.class || ''"></block-item>
                </div>
            </div>
            <div class="main-row">
            </div>
            <div class="main-row block-blur">
                <div class="row">
                </div>
            </div>
        </div>
        <!--      <block-item v-for="block in blocks"></block-item>-->
        <!--        <button v-on:click="runYoutube">Youtube</button>-->
    </div>
</template>

<script>
  import BlockItem from './LandingPage/BlockItem'
  import SystemInformation from './LandingPage/SystemInformation'
  import {execFile} from 'child_process'
  import axios from 'axios'

  export default {
    name: 'landing-page',
    components: { BlockItem, SystemInformation },
    data () {
      return {
        blocks: []
      }
    },
    mounted () {
      document.addEventListener('key:click', (event) => {
        const key = event.key

        if (['arrowdown', 'arrowup', 'arrowright', 'arrowleft'].indexOf(key) >= 0) {
          let index = this.blocks.findIndex((element) => {
            return element.children.findIndex(x => x.id === this.$root.selected.id) >= 0
          })

          let block = index >= 0 ? this.blocks[index].children.findIndex(x => x.id === this.$root.selected.id) : 0

          let switchLine = key === 'arrowdown' ? 1 : (key === 'arrowup' ? -1 : 0)
          let switchBlock = key === 'arrowright' ? 1 : (key === 'arrowleft' ? -1 : 0)

          index = index >= 0 ? index + switchLine : 0
          if (index > this.blocks.length - 1) {
            index = this.blocks.length - 1
          } else if (index < 0) {
            index = 0
          }

          const len = this.blocks[index].children.length - 1

          block = block > len ? len : (block >= 0 ? block + switchBlock : 0)
          if (block > len) {
            block = len
          } else if (block < 0) {
            block = 0
          }

          this.$root.selected = this.blocks[index].children[block]
        }

        if (key === 'enter' && this.$root.selected) {
          const block = this.$root.selected
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
          }
          // this.runYoutube()
        }
      })
      axios.get('http://vue-tests.local/api/blocks').then(response => (this.blocks = response.data.data))
    },
    methods: {
      click (key) {
        console.log(key)
      },
      open (link) {
        this.$electron.shell.openExternal(link)
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
    }
  }
</script>
<style lang="scss">
</style>

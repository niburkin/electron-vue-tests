<template>
    <div id="wrapper-base">
        <div id="wallpaper" v-bind:style="{backgroundImage:`url(${wallpaperUrl})`}">
        </div>
        <div id="wrapper">
            <block-header></block-header>
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
        </div>
    </div>
</template>

<script>
  import BlockItem from './LandingPage/BlockItem'
  import BlockHeader from './Base/BlockHeader'
  import axios from 'axios'
  import jQuery from 'jquery'
  import { keyType } from '../store/enums'

  export default {
    name: 'landing-page',
    components: { BlockItem, BlockHeader },
    data () {
      return {
        wallpaperUrl: '',
        blocks: [],
        isMounted: false
      }
    },
    destroyed () {
      document.removeEventListener('selected:item', this.onSelectEvent, false)
      document.removeEventListener('key:click', this.onKeyClick, false)
    },
    created () {
      if (this.$root.useApi) {
        axios.get(`${this.$root.apiUrl}/blocks`).then((response) => {
          this.setData(response.data.data)
        })
      } else {
        this.setData([
          {
            children: [
              {
                id: 1,
                class: 'col-md-4',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg',
                type: 'url',
                url: 'https://youtube.com'
              },
              {
                id: 2,
                class: 'col-md-4',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              },
              {
                id: 3,
                class: 'col-md-4',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              }
            ]
          },
          {
            children: [
              {
                id: 4,
                class: 'col-md-3',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              },
              {
                id: 5,
                class: 'col-md-3',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              },
              {
                id: 6,
                class: 'col-md-3',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              },
              {
                id: 7,
                class: 'col-md-3',
                title: 'title',
                image: 'https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg'
              }
            ]
          }
        ])
      }

      document.addEventListener('key:click', this.onKeyClick)
      document.addEventListener('selected:item', this.onSelectEvent)
    },
    methods: {
      onSelectEvent (event) {
        const item = event.object
        if (this.wallpaperUrl !== item.wallpaper) {
          const wallpaper = jQuery('#wallpaper')
          if (this.wallpaperUrl) {
            wallpaper.fadeOut(100, () => {
              this.wallpaperUrl = item.wallpaper
              wallpaper.fadeIn(150)
            })
          } else {
            wallpaper.fadeIn(300, () => {
              this.wallpaperUrl = item.wallpaper
            })
          }
        }
      },
      onKeyClick (event) {
        const key = event.key

        if (this.$router.currentRoute.name !== 'main') { return }

        if ([keyType.UP, keyType.DOWN, keyType.LEFT, keyType.RIGHT].indexOf(key) >= 0 && this.blocks.length > 0) {
          let index = this.blocks.findIndex((element) => {
            return element.children.findIndex(x => this.$root.selected && x.id === this.$root.selected.id) >= 0
          })

          let block = index >= 0 ? this.blocks[index].children.findIndex(x => this.$root.selected && x.id === this.$root.selected.id) : 0

          let switchLine = key === keyType.DOWN ? 1 : (key === keyType.UP ? -1 : 0)
          let switchBlock = key === keyType.RIGHT ? 1 : (key === keyType.LEFT ? -1 : 0)

          index = index >= 0 ? index + switchLine : 0
          if (index >= this.blocks.length) {
            index = this.blocks.length - 1
          }
          if (index < 0) {
            index = 0
          }

          const len = this.blocks[index].children.length - 1

          block = block > len ? len : (block >= 0 ? block + switchBlock : 0)
          if (block > len) {
            block = len
          } else if (block < 0) {
            block = 0
          }

          this.$root.setSelected(this.blocks[index].children[block])
        }

        if (key === keyType.SELECT && this.$root.selected) {
          const block = this.$root.selected
          this.$root.useObject(block)
        }
      },
      click (key) {
        console.log(key)
      },
      setData (data) {
        this.blocks = data

        if (this.blocks.length > 0) {
          this.$root.setSelected(this.blocks[0].children[0])
        }
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
<style lang="scss">
</style>

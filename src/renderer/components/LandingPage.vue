<template>
    <div id="wrapper-base">
        <div id="wallpaper">
        </div>
        <div id="wrapper">
            <block-header></block-header>
            <div class="content">
                <hooper
                        ref="slider"
                        id="vertical-slider"
                        :vertical="true"
                        :settings="sliderSettings"
                        style="height: 100%"
                        :itemsToShow="2.2"
                >
                    <slide v-for="block in blocks">
                        <div class="block-item">
                            <hooper style="height: 100%" :settings="sliderSettings" :horizontal="true" :itemsToShow="3.2" :itemsToSlide="1">
                                <slide v-for="item in block.children">
                                    <div class="block-item">
                                        <block-item :item="item"></block-item>
                                    </div>
                                </slide>
                            </hooper>
                        </div>
                    </slide>
                </hooper>
            </div>
        </div>
    </div>
</template>

<script>
  import BlockItem from './LandingPage/BlockItem'
  import BlockHeader from './Base/BlockHeader'
  import {Hooper, Slide} from 'hooper'
  import axios from 'axios'
  import jQuery from 'jquery'
  import { keyType } from '../store/enums'

  export default {
    name: 'landing-page',
    components: { Hooper, Slide, BlockItem, BlockHeader },
    data () {
      return {
        sliderSettings: {
          centerMode: true,
          keysControl: false,
          touchDrag: false,
          mouseDrag: false,
          shortDrag: false,
          wheelControl: false
        },
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

        if ([keyType.UP, keyType.DOWN, keyType.LEFT, keyType.RIGHT, keyType.SELECT].indexOf(key) >= 0 && this.blocks.length > 0) {
          const slider = this.$refs.slider
          const { currentSlide, slidesCount } = slider.$data

          console.log(currentSlide)
          if (key === keyType.UP && currentSlide + 1 > 1) {
            slider.slidePrev()
          }

          if (key === keyType.DOWN && currentSlide + 1 < slidesCount) {
            slider.slideNext()
          }

          if (slider.$children[currentSlide].$children.length > 0) {
            const children = slider.$children[currentSlide].$children[0]

            if (key === keyType.LEFT && children.currentSlide + 1 > 1) {
              children.slidePrev()
            }
            if (key === keyType.RIGHT && children.currentSlide + 1 < children.slidesCount) {
              children.slideNext()
            }

            console.log(children.currentSlide)

            this.$root.setSelected(children.$children[children.currentSlide].$children[0].item)
            if (key === keyType.SELECT) {
              const block = this.$root.selected
              this.$root.useObject(block)
            }
          }
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

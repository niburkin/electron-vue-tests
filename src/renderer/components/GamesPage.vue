<template>
    <div id="wrapper-base">
        <div id="wrapper">
            <block-header></block-header>
            <div class="content">
                <div id="games-content">
                    <hooper ref="slider"
                            id="game-slider"
                            style="height: auto"
                            :settings="settings">
                        <slide v-for="file in files">
                            <block-item :item="file" v-on:select="onSelectItem" :selected="selectedIndex === file.index"></block-item>
                        </slide>
                    </hooper>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { Hooper, Slide } from 'hooper'
  import BlockHeader from './Base/BlockHeader'
  import BlockItem from './GamesPage/BlockItem'
  import fs from 'fs'
  import { keyType } from '../store/enums'

  export default {
    name: 'games-page',
    components: {BlockHeader, BlockItem, Hooper, Slide},
    data () {
      return {
        selectedIndex: 0,
        settings: {
          itemsToShow: 3,
          itemsToSlide: 1,
          centerMode: true,
          keysControl: false,
          touchDrag: false,
          mouseDrag: false,
          shortDrag: false,
          wheelControl: false
        },
        files: []
      }
    },
    destroyed () {
      document.removeEventListener('key:click', this.onKeyClick, false)
    },
    mounted () {
      let array = []
      this.$root.games.gamecube.dirs.forEach((dir) => {
        array = array.concat(fs.readdirSync(dir).map((item) => {
          return {
            name: item,
            fullpath: `${dir}\\${item}`
          }
        }))
      })
      this.files = array.map((item, index) => {
        return {
          file: item.name,
          fullpath: item.fullpath,
          index: index
        }
      })

      document.addEventListener('key:click', this.onKeyClick)
    },
    methods: {
      onSelectItem (item) {
        this.selectedIndex = item
      },
      onKeyClick (event) {
        const key = event.key
        const slider = this.$refs.slider
        const { currentSlide, slidesCount, isSliding } = slider.$data

        if ([keyType.UP, keyType.DOWN, keyType.LEFT, keyType.RIGHT, keyType.SELECT].indexOf(key) >= 0 && !isSliding) {
          if (key === keyType.LEFT && currentSlide + 1 > 1) {
            slider.slidePrev()
          }

          if (key === keyType.RIGHT && currentSlide + 1 < slidesCount) {
            slider.slideNext()
          }

          this.onSelectItem(slider.$data.currentSlide)

          if (key === keyType.SELECT) {
            this.launch(this.files[currentSlide].fullpath)
          }
        }
      },
      launch (file) {
        // return
        // eslint-disable-next-line no-unreachable
        let attributes = this.$root.games.gamecube.arguments
        attributes.push(file)
        this.$root.runCommand(
          this.$root.games.gamecube.path,
          attributes
        )
      }
    }
  }
</script>
<style lang="scss">
</style>

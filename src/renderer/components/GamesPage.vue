<template>
    <div id="wrapper-base">
        <div id="wrapper">
            <block-header></block-header>
            <div class="content">
                <div id="games-content">
                    <div class="main-row" v-for="row in rows">
                        <div class="row">
                            <block-item :item="file" v-on:select="onSelectItem" :selected="selectedIndex === file.index" v-for="file in row"></block-item>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import BlockHeader from './Base/BlockHeader'
  import BlockItem from './GamesPage/BlockItem'
  import fs from 'fs'
  import { keyType } from '../store/enums'

  export default {
    name: 'games-page',
    components: {BlockHeader, BlockItem},
    data () {
      return {
        rows: [],
        files: [],
        page: 1,
        selectedIndex: 0
      }
    },
    destroyed () {
      document.removeEventListener('key:click', this.onKeyClick, false)
    },
    mounted () {
      let array = []
      this.$root.games.gamecube.dirs.forEach((dir) => {
        array = array.concat(fs.readdirSync(dir).map((item) => {
          return `${item}`
        }))
      })
      this.files = array.map((item, index) => {
        return {
          file: item,
          index: index
        }
      })

      document.addEventListener('key:click', this.onKeyClick)

      this.updateRows()
    },
    methods: {
      onSelectItem (item) {
        this.selectedIndex = item.index
      },
      onKeyClick (event) {
        const key = event.key

        if ([keyType.UP, keyType.DOWN, keyType.LEFT, keyType.RIGHT].indexOf(key) >= 0) {
          const vector = {
            top: key === keyType.UP ? 1 : (key === keyType.DOWN ? -1 : 0),
            right: key === keyType.LEFT ? -1 : (key === keyType.RIGHT ? 1 : 0)
          }

          const offset = vector.right + (-vector.top * 4)

          this.selectedIndex = this.$root.clamp(this.selectedIndex + offset, 0, this.files.length - 1)

          const start = (this.page - 1) * 8
          if (this.selectedIndex < start) {
            this.page -= 1
          }
          if (this.selectedIndex > start + 7) {
            this.page += 1
          }
          this.updateRows()
        }
      },
      updateRows () {
        let pages = Math.ceil(this.files.length / 8)
        this.page = Math.min(Math.max(this.page, 1), pages)
        const start = (this.page - 1) * 8

        this.rows = [
          this.files.slice(start, start + 4),
          this.files.slice(start + 4, start + 8)
        ]
      },
      launch (file) {
        return
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

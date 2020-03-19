<template>
    <div v-bind:class="classes">
        <div class="main-block" v-bind:class="{ 'selected': this.$root.selected && this.$root.selected.id == this.item.id }" v-on:mouseenter="mouseEnter" v-on:mouseleave="mouseLeave">
            <div class="image">
                <img v-bind:src="item.image" alt="">
            </div>
            <h5 class="title">
                {{ item.title }}
            </h5>
        </div>
    </div>
</template>

<script>
  export default {
    props: ['classes', 'item'],
    data () {
      return {
        selected: false
      }
    },
    methods: {
      mouseEnter () {
        this.$root.selected = this.item
        this.selected = true
      },
      mouseLeave () {
        this.selected = false
      }
    }
  }
</script>

<style scoped>

</style>
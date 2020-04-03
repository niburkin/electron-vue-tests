<template>
    <div class="game-block" v-on:mouseenter="onMouseEnter" v-bind:class="{ selected }">
        <div class="image">
            <img src="https://sun4-12.userapi.com/GFrTojeyuJFRUhWaZbQofydd7mzPykyNUETM4w/-WF7LZoCsOE.jpg" alt="">
        </div>
        <div class="title">
        {{ item.file }}
        </div>
    </div>
</template>

<script>
  export default {
    name: 'BlockItem',
    props: ['item', 'selected'],
    methods: {
      onMouseEnter () {
        this.$emit('select', this.item)
      }
    }
  }
</script>

<style scoped>

</style>

<template>
    <div class="header">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-3"></div>
            <div class="col-md-3"></div>
            <div class="col-md-3" id="clock">
                <div class="time">{{ time.hours }}<span v-bind:class="{ visible: time.pointVisible }">:</span>{{ time.minutes }}</div>
                <div class="year">{{ time.fullDate }}</div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'block-header',
    data () {
      return {
        time: {
          hours: 0,
          pointVisible: true,
          minutes: 0,
          fullDate: ''
        }
      }
    },
    mounted () {
      this.updateDate()
    },
    methods: {
      updateDate () {
        const date = new Date()

        const show = Math.round(date.getTime() / 1000) % 2 === 1
        this.time.hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        this.time.pointVisible = show
        this.time.minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        const month = this.$root.locale.base.months[date.getMonth()]
        this.time.fullDate = `${date.getDate()} ${month} ${date.getFullYear().toString().substring(2)}`
        setTimeout(this.updateDate, 1000)
      }
    }
  }
</script>

<style scoped>

</style>

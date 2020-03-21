import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/games',
      name: 'games-page',
      component: require('@/components/GamesPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

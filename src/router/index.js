import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecommendationView from '../views/RecommendationView.vue'
import UserView from '../views/UserView.vue'
import MovieView from '../views/MovieView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/recommendation',
    name: 'recommendation',
    component: RecommendationView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  },
  {
    path: '/movie/:movieId',
    name: 'movie',
    component: MovieView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

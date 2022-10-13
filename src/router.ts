import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeScreen from './screens/HomeScreen.vue'
import LoginScreen from './screens/LoginScreen.vue'
import MarketScreen from './screens/MarketScreen.vue'
import HomePage from './pages/HomePage.vue'
import MarketsPage from './pages/MarketsPage.vue'
import TradePage from './pages/TradePage.vue'
import WalletPage from './pages/WalletPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/t/home',
  },
  {
    path: '/t/',
    component: HomeScreen,
    children: [
      {
        path: '',
        redirect: '/t/home',
      },
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'markets',
        component: MarketsPage,
      },
      {
        path: 'trade',
        component: TradePage,
      },
      {
        path: 'wallet',
        component: WalletPage,
      },
    ],
  },
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/market',
    component: MarketScreen,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

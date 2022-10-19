import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginScreen from './screens/LoginScreen.vue'
import MarketScreen from './screens/MarketScreen.vue'
import HomePage from './pages/HomePage.vue'
import MarketsPage from './pages/MarketsPage.vue'
import TradePage from './pages/TradePage.vue'
import WalletPage from './pages/WalletPage.vue'
import TabsPage from './pages/TabsPage.vue'
import SearchMarketScreen from './screens/SearchMarketScreen.vue'
import UserScreen from './screens/UserScreen.vue'
import { fetchDataMiddleware } from '~/middleware/fetchData.global'

let firstRoute = true

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/t/home',
  },
  {
    path: '/t/',
    component: TabsPage,
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
  {
    path: '/search',
    component: SearchMarketScreen,
  },
  {
    path: '/user',
    component: UserScreen,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const globalMiddleware = [
  fetchDataMiddleware,
]

router.beforeEach(async (to, from, next) => {
  const publicStore = usePublicStore()

  if (firstRoute) {
    firstRoute = false
    for await (const middleware of globalMiddleware) {
      middleware()
    }

    if (to.path !== '/t/home') {
      return next('/t/home')
    }
  }

  if (publicStore.loading && to.path !== '/t/home') {
    return next('/t/home')
  }

  if (to.meta.middleware || to.matched.some(record => record.meta.middleware)) {
    const middleware = (to.meta.middleware || to.matched.filter(record => record.meta.middleware)[0].meta.middleware) as unknown as Middleware[]

    for await (const m of middleware) {
      const n = m(to, from)
      if (n) {
        return n
      }
    }
  }

  return next()
})

export default router

import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginScreen from './screens/Login.vue'
import RegisterScreen from './screens/Register.vue'
import HomePage from './pages/Home.vue'
import MarketsPage from './pages/Markets.vue'
import TradePage from './pages/Trade.vue'
import WalletPage from './pages/Wallet.vue'
import TabsPage from './pages/Tabs.vue'
import SearchMarketScreen from './screens/SearchMarket.vue'
import UserScreen from './screens/User.vue'
import { fetchDataMiddleware } from '~/middleware/fetchData.global'
import ConfirmEmail from './screens/ConfirmEmail.vue'

let firstRoute = true

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/home',
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
    path: '/screen/login',
    component: LoginScreen,
  },
  {
    path: '/screen/register',
    component: RegisterScreen,
  },
  {
    path: '/screen/confirm-email',
    component: ConfirmEmail,
  },
  {
    path: '/screen/search',
    component: SearchMarketScreen,
  },
  {
    path: '/screen/user',
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

    if (to.path !== '/home') {
      return next('/home')
    }
  }

  if (publicStore.loading && to.path !== '/home') {
    return next('/home')
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

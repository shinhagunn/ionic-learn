import { RouteLocationRaw } from 'vue-router'
import router from '~/router'

export const navigateTo = (to: RouteLocationRaw) => {
  return router.push(to)
}

export const useRouter = () => {
  return router
}

export const useRoute = () => {
  return router.currentRoute
}

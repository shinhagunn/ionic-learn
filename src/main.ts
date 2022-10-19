import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue'
import { VueQueryPlugin } from 'vue-query'
import vant from 'vant'
import App from './App.vue'
import router from './router'

/* Core CSS required for Ionic components to work properly */
import 'uno.css'
import 'virtual:unocss-devtools'
import '@ionic/vue/css/core.css'
import '~/assets/styles/index.less'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'

const pinia = createPinia()
const app = createApp(App)
  .use(IonicVue, {
    swipeBackEnabled: false,
    mode: 'ios',
  })
  .use(vant)
  // .use(VueQueryPlugin)
  .use(pinia)
  .use(router)

router.isReady().then(() => {
  app.mount('#app')
})

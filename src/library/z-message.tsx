import ZEventBus from './ZEventBus'
import type { MessageOptions } from '~/types'
import { MessagePlacement } from '~/types'
import { RandomString } from '~/mixins'

export default (options: MessageOptions) => {
  const key = RandomString()

  if (!options.placement) options.placement = MessagePlacement.Bottom

  const App = defineComponent({
    key: `${key}-${options.placement}`,
    setup() {
      let closeTimeout: NodeJS.Timeout

      function close() {
        clearTimeout(closeTimeout)

        ZEventBus.emit('z-remove-message', `${key}-${options.placement}`)
      }

      onMounted(() => {
        closeTimeout = setTimeout(() => {
          close()
        }, options.duration || 3500)
      })

      return () => (
        <div class={['z-message', `z-message-${options.placement}`]}>
          <div class="z-message-content">
            { options.message }
          </div>
        </div>
      )
    },
  })

  ZEventBus.emit('z-new-message', App)
}

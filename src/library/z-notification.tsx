import ZEventBus from './ZEventBus'
import type { NotificationOptions } from '~/types'
import { NoticeType, Placement } from '~/types'
import { RandomString } from '~/mixins'

const createNotification = (type: NoticeType) => {
  return (options: NotificationOptions) => {
    const key = RandomString()

    if (!options.placement) options.placement = Placement.TopRight

    const App = defineComponent({
      key: `${key}-${options.placement}`,
      setup() {
        let closeTimeout: NodeJS.Timeout

        function close() {
          clearTimeout(closeTimeout)

          ZEventBus.emit('z-remove-notification', `${key}-${options.placement}`)
        }

        onMounted(() => {
          closeTimeout = setTimeout(() => {
            close()
          }, options.duration || 3500)
        })

        let iconClass: string
        switch (type) {
          case NoticeType.Success:
            iconClass = 'text-up'
            break
          case NoticeType.Warn:
            iconClass = 'text-warn'
            break
          case NoticeType.Error:
            iconClass = 'text-down'
            break
        }

        return () => (
          <div class={['z-notification', `z-notification-${options.placement}`]}>
            <div class={['z-notification-icon', iconClass]}>
              <i class={`z-icon-${type}`} />
            </div>
            <div class="z-notification-content">
              {
                options.title && <div class={['z-notification-title']}>
                  { options.title }
                </div>
              }
              {
                options.description && <div class="z-notification-description">
                  { options.description }
                </div>
              }
            </div>
            <div class="z-notification-close">
              <i class="z-icon-close" onClick={close} />
            </div>
          </div>
        )
      },
    })

    ZEventBus.emit('z-new-notification', App)
  }
}

type NotificationApi = { [key in NoticeType]: (options: NotificationOptions) => void }

const lstNotification: NotificationApi = {} as NotificationApi

for (const type in NoticeType) {
  lstNotification[type.toLowerCase() as NoticeType] = createNotification(type.toLowerCase() as NoticeType)
}

export default lstNotification

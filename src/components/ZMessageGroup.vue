<script setup lang="ts">
import ZEventBus from '~/library/ZEventBus'
import { MessagePlacement } from '~/types'

const childrens = ref<any[]>([])

  const lstMessageTop = computed(() => {
  return childrens.value.filter(child => child.value.key.includes(MessagePlacement.Top))
})

const lstMessageMiddle = computed(() => {
  return childrens.value.filter(child => child.value.key.includes(MessagePlacement.Middle))
})

const lstMessageBottom = computed(() => {
  return childrens.value.filter(child => child.value.key.includes(MessagePlacement.Bottom)).reverse()
})

onMounted(() => {
  ZEventBus.on('z-new-message', appendNewMessage)
  ZEventBus.on('z-remove-message', removeMessage)
})

onBeforeUnmount(() => {
  ZEventBus.off('z-new-message', appendNewMessage)
  ZEventBus.off('z-remove-message', removeMessage)
})

function removeMessage(key: any) {
  const index = childrens.value.findIndex(child => child.value.key === key)

  if (index === -1) return
  childrens.value.splice(index, 1)
}

function appendNewMessage(message: any) {
  childrens.value.push(shallowRef(message))
}
</script>

<template>
  <div class="z-message-group">
    <div class="z-message-group-top">
      <transition-group name="z-message-group-top" tag="div">
        <template v-for="child in lstMessageTop" :key="child.value.key">
          <component :is="child.value" />
        </template>
      </transition-group>
    </div>
    <div class="z-message-group-middle">
      <transition-group name="z-message-group-middle" tag="div">
        <template v-for="child in lstMessageMiddle" :key="child.value.key">
          <component :is="child.value" />
        </template>
      </transition-group>
    </div>
    <div class="z-message-group-bottom">
      <transition-group name="z-message-group-bottom" tag="div">
        <template v-for="child in lstMessageBottom" :key="child.value.key">
          <component :is="child.value" />
        </template>
      </transition-group>
    </div>
  </div>
</template>

<style lang="less">
.z-message {
  position: relative;
  display: flex;
  background-color: rgba(153, 160, 180, 0.075);
  color: @text-color;
  padding: 8px 12px;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 4px 12px rgba(108, 117, 134, 0.1);
  transition: all 0.3s;
  width: max-content;

  &-icon {
    font-size: 16px;
    margin-right: 8px;
  }

  &-group {
    z-index: 999;

    &-top {
      position: fixed;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 1;

      &-enter-active, &-leave-active {
        transition: all 0.3s;
      }

      &-enter-active, &-leave-to {
        opacity: 0;
        transform: translateY(-100%);
      }
    }

    &-middle {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;

      &-enter-active, &-leave-active {
        transition: all 0.3s;
      }

      &-enter-active, &-leave-to {
        opacity: 0;
        // transform: translateY(-100%);
      }
    }

    &-bottom {
      position: fixed;
      bottom: 55px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 1;

      &-enter-active, &-leave-active {
        transition: all 0.3s;
      }

      &-enter-active, &-leave-to {
        opacity: 0;
        transform: translateY(100%);
      }
    }
  }

  &-content {
    display: flex;
    justify-content: center;
    flex-flow: column;
    flex-direction: column;
  }

  &-title {
    display: inline-block;
    padding-right: 24px;
    font-size: 16px;
    line-height: 24px;
  }

  &-title + &-description {
    margin-top: 8px;
  }

  &-description {
    font-size: 14px;
    font-weight: normal;
  }

  &-close {
    font-size: 12px;
    cursor: pointer;
    position: absolute;
    right: 14px;
    color: @gray-color;
    transition: all 0.3s;

    &:hover {
      color: @action-color;
    }
  }
}
</style>

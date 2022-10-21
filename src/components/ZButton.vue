<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  type?: string
  htmlType?: ButtonHTMLAttributes['type']
  selected?: boolean
  loading?: boolean
  disabled?: boolean
  delay?: {
    time: number
    content: string
  }
  isRouterLink?: boolean
  to?: string
}>(), {
  htmlType: 'button',
})

const emit = defineEmits(['click'])

let delayInterval: NodeJS.Timer
const remainingTime = ref(0)

const isDelaying = computed(() => {
  return remainingTime.value > 0
})

const clearDelay = () => {
  clearInterval(delayInterval)
  remainingTime.value = 0
}

const StartDelay = () => {
  if (!props.delay) return

  remainingTime.value = props.delay.time
  delayInterval = setInterval(() => {
    remainingTime.value = remainingTime.value - 1

    if (remainingTime.value === 0) {
      clearDelay()
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearDelay()
})

const onButtonClick = () => {
  if (props.disabled) return
  if (props.loading) return
  if (isDelaying.value) return

  emit('click', this)
}

defineExpose({
  StartDelay,
})
</script>

<template>
  <button
    v-bind="$attrs"
    class="z-button" :class="[
      { 'z-button-selected': selected, [`z-button-${type}`]: !!type, 'z-button-delay': !!delay, 'z-button-delaying': isDelaying },
    ]"
    :type="htmlType"
    :disabled="disabled || isDelaying"
    @click="onButtonClick"
  >
    <span>
      <template v-if="isDelaying">
        {{ delay?.content?.replace("#{time}", remainingTime.toString()) }}
      </template>
      <slot v-else />
    </span>
  </button>
</template>

<style lang="less">
.z-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  text-align: center;
  color: white;
  border: 1px solid;
  border-color: @primary-color;
  background-color: @primary-color;
  border-radius: 2px;
  font-weight: 400;
  line-height: initial;
  padding: 2px 16px;
  user-select: none;
  touch-action: manipulation;
  transition: all 0.3s;

  &:disabled {
    background-color: @btn-disabled-color !important;
    border-color: @btn-disabled-color !important;
    color: @gray-color !important;
    cursor: not-allowed;
  }

  &:disabled&-delay {
    background-color: transparent !important;
  }

  &-delay {
    color: @primary-color !important;
    border: none;
    background-color: transparent !important;
  }

  &-delaying {
    color: @gray-color !important;
    cursor: default;
  }

  a {
    color: @white-color !important;
  }

  span {
    display: flex;
    flex: none;
  }

  &:hover {
    color: @white-color;
    background-color: @primary-color;
  }

  &-primary {
    color: @white-color;
    background-color: @primary-color;
    border-color: @primary-color;
  }

  &-selected {
    background-color: @primary-color;
    border-color: @primary-color;
    color: @white-color;
  }

  &-selected&-primary,
  &-primary:hover {
    background-color: @primary-color;
    border-color: @primary-color;
  }

  .z-loading {
    position: relative;
    background-color: transparent;
    height: auto;
    width: auto;
    display: flex;
    margin-right: 8px;
  }

  .z-loading-icon {
    border: 3px solid @white-color !important;
    width: 20px !important;
    height: 20px !important;
  }

  .z-loading-icon-inner {
    background-color: @white-color !important;
  }

  &:disabled {
    .z-loading-icon {
      border: 3px solid @gray-color !important;
      width: 20px !important;
      height: 20px !important;
    }

    .z-loading-icon-inner {
      background-color: @gray-color !important;
    }
  }
}
</style>

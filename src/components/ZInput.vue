<script setup lang="ts">
import { RandomString } from '~/mixins'
import { InputType } from '~/types'

const props = withDefaults(defineProps<{
  type?: InputType
  placeholder?: string
  name?: string
  maxLength?: number
  disabled?: boolean
  error?: string
  class?: string | string[] | Record<string, any> | Record<string, any>[]
  modelValue?: string
}>(), {
  type: InputType.Text,
  modelValue: '',
})
const emit = defineEmits(['update:modelValue', 'focus', 'input', 'blur', 'keydown', 'paste'])

const instance = getCurrentInstance()
const input = templateRef<HTMLInputElement>('input')
const value = useVModel(props, 'modelValue', emit)
const inputFocused = ref(false)
const randomName = RandomString()
const showPassword = ref(false)

const inputType = computed(() => {
  return showPassword.value ? InputType.Text : props.type === InputType.Password ? InputType.Password : InputType.Text
})

const onInput = (e: InputEvent) => {
  const target = (e.target as HTMLInputElement)
  let inputValue = target.value

  if (props.type === InputType.Number) {
    if (/\D/.test(inputValue)) {
      inputValue = inputValue.replace(/\D/g, '')
    }
  } else if (props.type === InputType.Decimal) {
    if (/[^0123456789.]/.test(inputValue)) {
      inputValue = inputValue.replace(/[^0123456789.]/g, '')
    }

    const numberDot = inputValue.match(/\./g)
    if (numberDot && numberDot.length > 1) {
      if (inputValue[inputValue.length - 1] === '.') {
        inputValue = inputValue.slice(0, inputValue.length - 1)
      }
    }
  }
  if (props.maxLength && inputValue.length > props.maxLength) {
    inputValue = inputValue.slice(0, props.maxLength)
  }

  value.value = inputValue
  target.value = inputValue

  if (instance?.proxy) {
    instance.proxy.$forceUpdate()
  }

  emit('input', e)
}

const focus = () => {
  input.value.focus()
}

const blur = () => {
  input.value.blur()
}

const onFocus = (event: FocusEvent) => {
  emit('focus', event)
  inputFocused.value = true
}

const onBlur = (event: FocusEvent) => {
  emit('blur', event)
  inputFocused.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const onPaste = (event: ClipboardEvent) => {
  emit('paste', event)
}

defineExpose({
  focus,
  blur,
})
</script>

<template>
  <div
    class="z-input"
    :class="[
      {
        'z-input-focused': inputFocused,
        'z-input-disabled': disabled,
        'z-input-error': !!error,
      },
      $props.class,
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <div v-if="$slots.prefix" class="z-input-prefix">
      <slot name="prefix" />
    </div>
    <input
      ref="input"
      :value="value"
      :type="inputType"
      :placeholder="placeholder"
      :autocomplete="randomName"
      :name="randomName"
      :max-length="maxLength"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
    >
    <!-- <div v-if="type === InputType.Password" class="z-input-suffix">
      <ZIcon :type="showPassword ? 'visible' : 'invisible'" @click="showPassword = !showPassword" />
    </div> -->
    <div v-if="$slots.suffix" class="z-input-suffix">
      <slot name="suffix" />
    </div>
  </div>
  <div v-if="!!error" class="z-input-error-container" v-bind="$attrs">
    <transition name="z-input-error">
      <div class="z-input-error-content">
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<style lang="less">
.z-input {
  display: flex;
  padding: 0 8px;
  align-items: center;
  height: 35px;
  line-height: 35px;
  color: white;
  transition: all 0.3s ease-in-out;
  border-radius: 4px;

  &-disabled {
    cursor: not-allowed;
    input {
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  input {
    background-color: transparent;
    width: 100%;
    height: 100%;
    color: inherit;
    &::placeholder {
      color: @placeholder-color;
    }
  }

  &-error {
    &-container {
      position: absolute;
      height: 28px;
      width: 100%;
      overflow: hidden;
    }

    &-content {
      position: absolute;
      width: 100%;
      height: 20px;
      margin-top: 8px;
      line-height: 20px;
      color: @down-color;
      top: 0;
      left: 0;
      opacity: 1;
      transition: all 0.3s;
    }

    &-enter,
    &-leave-active {
      opacity: 0;
      left: 0;
      top: -20px;
    }

    .z-auth-input-container {
      border-color: @down-color !important;
    }
  }
}
</style>

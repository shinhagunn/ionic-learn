<script setup lang="ts">
import TimesCircleDuotone from '../icon/TimesCircleDuotone.vue'
import { InputType } from '~/types'
import type { ZValidate } from '~/types'

const props = withDefaults(defineProps<{
  type?: InputType
  placeholder?: string
  label?: string
  maxLength?: number
  validate?: ZValidate[]
  transformErrors?: Record<string, string>
  class?: string | string[] | Record<string, any> | Record<string, any>[]
  modelValue?: string
}>(), {
  modelValue: '',
  type: InputType.Text,
})

const emit = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="z-auth-input">
    <label class="z-auth-input-label">{{ label || placeholder }}</label>
    <ZInput
      v-model="value"
      :type="type"
      :max-length="maxLength"
      :validate="validate"
      :transform-errors="transformErrors"
    >
      <template #suffix>
        <TimesCircleDuotone v-if="value && type === InputType.Text" @click="value = ''" />
        <slot v-else name="suffix" />
      </template>
    </ZInput>
  </div>
</template>

<style lang="less">
.z-auth-input {
  &-label {
    display: block;
    margin-bottom: 6px;
    color: @gray-color;
    font-size: 14px;
  }

  .z-input {
    background-color: rgba(@exchange-border-color, 0.5) !important;
    height: 38px;

    input {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
        -webkit-transition-delay: 9999s;
      }
    }

    &-suffix {
      display: flex;
      align-items: center;

      svg {
        width: 20px;
        height: 20px;
      }

      .cls-1 {
        fill: rgba(@gray-color, 0.5);
      }

      .cls-2 {
        fill: @exchange-card-background;
      }
    }
  }
}
</style>

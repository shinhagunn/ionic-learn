<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

defineProps<{
  type?: ButtonHTMLAttributes['type']
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <ZButton class="z-auth-button" :html-type="type" :loading="loading" :disabled="disabled">
    <slot />
  </ZButton>
</template>

<style lang="less">
.z-auth-button {
  background-color: @primary-color;
  color: white;
  width: 100%;
  font-size: 16px;
  border: 0;
  border-radius: 4px;
  padding: 8px 0 !important;

  .z-loading-icon {
    width: 18px !important;
    height: 18px !important;
  }
}
</style>

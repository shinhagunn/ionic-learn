<script setup lang="ts">
import { RandomString } from '~/mixins'

const emit = defineEmits(['submit'])
const elementID = RandomString()

const onSubmit = (event: Event) => {
  event.preventDefault()
  emit('submit', event)
}
</script>

<template>
  <form :id="elementID" class="z-form" autocomplete="false" @submit="onSubmit">
    <slot />
  </form>
</template>

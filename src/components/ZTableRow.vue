<script setup lang="ts">
defineProps<{
  isRouterLink?: boolean
  to?: string
  selected: boolean
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <div class="z-table-row" :class="[{ 'z-table-row-selected': selected }]" @click="emit('click', $event)">
    <slot />
  </div>
</template>

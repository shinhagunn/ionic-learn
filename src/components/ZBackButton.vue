<script setup lang="ts">
import type { AnimationBuilder } from '@ionic/vue'
import { useIonRouter } from '@ionic/vue'
import AngerLeftFilled from '~/components/icon/AngerLeftFilled.vue'
const props = defineProps<{
  animation?: AnimationBuilder
}>()
const ionRouter = useIonRouter()
</script>

<template>
  <div class="z-back-button" @click="ionRouter.back(animation)">
    <AngerLeftFilled />
  </div>
</template>

<style lang="less">
.z-back-button {
  display: flex;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
  }

  .cls-1 {
    fill: @gray-color;
  }
}
</style>

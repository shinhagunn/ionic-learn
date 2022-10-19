<script setup lang="ts">
import { createAnimation, useIonRouter } from '@ionic/vue';

const leavingAnimation = (_: unknown, opts: any) => {
  return createAnimation()
    .addAnimation(createAnimation().addElement(opts.enteringEl).duration(200).fromTo('opacity', 1, 1))
    .addElement(opts.leavingEl)
    .duration(200)
    .keyframes([
      { offset: 0, transform: 'translate(0, 0)', opacity: 1 },
      { offset: 1, transform: 'translate(0, 100%)', opacity: 0.3 },
    ])
}
const ionRouter = useIonRouter()
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <button v-text="'Home'" @click="ionRouter.back(leavingAnimation)" />
        </ion-buttons>
        <ion-title class="text-sm">
          LOGIN
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      Đây là login screen
    </ion-content>
  </ion-page>
</template>

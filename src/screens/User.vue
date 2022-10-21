<script setup lang="ts">
import type { AnimationBuilder } from '@ionic/vue'
import { createAnimation } from '@ionic/vue'

const leavingAnimation: AnimationBuilder = (_, opts) => {
  return createAnimation()
    .addAnimation(createAnimation().addElement(opts.enteringEl).duration(200).fromTo('opacity', 1, 1))
    .addElement(opts.leavingEl)
    .duration(200)
    .keyframes([
      { offset: 0, transform: 'translate(0, 0)', opacity: 1 },
      { offset: 1, transform: 'translate(-100%, 0)', opacity: 1 },
    ])
}
</script>

<template>
  <IonPage class="screen-user">
    <IonHeader>
      <IonToolbar>
        <ZBackButton :animation="leavingAnimation" />
        <IonTitle>My Navigation Bar</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      Hello ZSmartex
    </IonContent>
  </IonPage>
</template>

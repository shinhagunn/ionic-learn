<script setup lang="ts">
import { createAnimation, useIonRouter } from '@ionic/vue'

const enterAnimation = (baseEl: any) => {
  return createAnimation()
    .addElement(baseEl)
    .duration(2000)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '0.5' },
      { offset: 0.5, transform: 'scale(0.8)', opacity: '1' },
      { offset: 1, transform: 'scale(1)', opacity: '0.5' },
    ])
}
const ionRouter = useIonRouter()
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Wallet Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <IonButton @click="ionRouter.push('/login', enterAnimation)">
        Go to login
      </IonButton>
    </IonContent>
  </IonPage>
</template>

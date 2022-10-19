<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import { PopupAnimation } from '~/mixins'
const ionRouter = useIonRouter()
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Wallet Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <IonButton @click="ionRouter.push('/login', PopupAnimation)">
        Go to login
      </IonButton>
    </IonContent>
  </IonPage>
</template>

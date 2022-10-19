<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'

const ionRouter = useIonRouter()
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Trade Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <IonButton @click="ionRouter.push('/search')">
        Go to login
      </IonButton>
    </IonContent>
  </IonPage>
</template>

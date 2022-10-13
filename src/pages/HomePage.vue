<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navLink = () => {
  router.push('/market')
}
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Home Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <IonButton @click="navLink">
        Go to detail
      </IonButton>
    </IonContent>
  </IonPage>
</template>

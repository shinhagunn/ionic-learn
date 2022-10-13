<script setup lang="ts">
import {
	IonContent,
	IonHeader,
	IonPage,
  IonButton,
} from '@ionic/vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const navLink = () => {
	router.push('/market')
}
</script>

<template>
  <ion-page>
    <ion-header class="text-center">
      Home Page
    </ion-header>
    <ion-content :scroll-y="false">
      <ion-button @click="navLink">Go to detail</ion-button>
    </ion-content>
  </ion-page>
</template>
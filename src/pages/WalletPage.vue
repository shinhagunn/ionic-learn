<script setup lang="ts">
import {
	IonContent,
	IonHeader,
	IonPage,
  IonButton,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonModal,
} from '@ionic/vue'
import { templateRef } from '@vueuse/core';
import LoginScreen from '@/screens/LoginScreen.vue';

const target = templateRef('modal')

const cancel = () => {
  target.value.$el.dismiss(null, 'cancel')
}
</script>

<template>
  <ion-page>
    <ion-header class="text-center">
      Wallet Page
    </ion-header>
    <ion-content :scroll-y="false">
      <ion-button id="modal-login" expand="block">Open</ion-button>
    </ion-content>
    <LoginScreen />
  </ion-page>
</template>
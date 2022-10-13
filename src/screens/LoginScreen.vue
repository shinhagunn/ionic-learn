<script setup lang="ts">
import {
	IonHeader,
  IonToolbar,
  IonButtons,
  IonModal,
  IonTitle,
  IonButton,
} from '@ionic/vue'
import { templateRef } from '@vueuse/core';

const target = templateRef('modal')

const cancel = () => {
  target.value.$el.dismiss(null, 'cancel')
}

</script>

<template>
  <ion-modal ref="modal" trigger="modal-login">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-modal>
</template>
<script setup lang="ts">
import {
	IonContent,
	IonHeader,
	IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from '@ionic/vue'
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button text="Home" default-href="/t/home"></ion-back-button>
				</ion-buttons>
				<ion-title class="text-sm">MARKET</ion-title>
			</ion-toolbar>
		</ion-header>
    <ion-content>
      Đây là market screen
    </ion-content>
  </ion-page>
</template>
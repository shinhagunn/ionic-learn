<script setup lang="ts">
import LoginScreen from '~/screens/LoginScreen.vue'

const target = templateRef('modal')

const cancel = () => {
  target.value.$el.dismiss(null, 'cancel')
}
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Wallet Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <IonButton id="modal-login" expand="block">
        Open
      </IonButton>
    </IonContent>
    <LoginScreen />
  </IonPage>
</template>

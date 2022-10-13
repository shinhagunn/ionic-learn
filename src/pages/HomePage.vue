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
      <VanSwipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <VanSwipeItem>1</VanSwipeItem>
        <VanSwipeItem>2</VanSwipeItem>
        <VanSwipeItem>3</VanSwipeItem>
        <VanSwipeItem>4</VanSwipeItem>
      </VanSwipe>
      <IonButton @click="navLink">
        Go to detail
      </IonButton>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>

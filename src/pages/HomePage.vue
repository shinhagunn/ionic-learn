<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'

const router = useRouter()

const navLink = () => {
  router.push('/market')
}

const onSwiper = (swiper) => {
  console.log(swiper)
}
const onSlideChange = () => {
  console.log('slide change')
}
</script>

<template>
  <IonPage>
    <IonHeader class="text-center">
      Home Page
    </IonHeader>
    <IonContent :scroll-y="false">
      <swiper
        :slides-per-view="3"
        :space-between="50"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide>
      </swiper>
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

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Controller, EffectCoverflow, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const modules = [EffectCoverflow, Pagination, Controller]
</script>

<template>
  <div class="page-home-banner">
    <Swiper
      ref="swiper"
      effect="coverflow"
      slides-per-view="auto"
      :modules="modules"
      :space-between="0"
      :loop="true"
      :centered-slides="true"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      }"
    >
      <SwiperSlide>
        <img src="https://demo.zsmartex.com/api/v2/kouda/public/banners/e1aca21e-6ea6-4b94-9d91-37dae7c39e4a">
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://demo.zsmartex.com/api/v2/kouda/public/banners/e1aca21e-6ea6-4b94-9d91-37dae7c39e4a">
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://demo.zsmartex.com/api/v2/kouda/public/banners/e1aca21e-6ea6-4b94-9d91-37dae7c39e4a">
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style lang="less">
.page-home-banner {
  .swiper {
    width: 100%;

    &-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 150px;
      color: white;
      border-radius: 10px;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>

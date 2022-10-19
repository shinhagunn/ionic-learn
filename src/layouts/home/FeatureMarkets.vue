<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const modules = [Pagination]
const publicStore = usePublicStore()

const tickers = computed(() => {
  return publicStore.tickers.slice(0, 5)
})
</script>

<template>
  <div class="page-home-market">
    <Swiper
      v-if="publicStore.loading"
      :slides-per-view="3"
      :space-between="0"
      :slides-per-group="3"
    >
      <SwiperSlide v-for="item in 3" :key="item">
        <IonSkeletonText animated style="width: 100%" />
        <IonSkeletonText animated style="width: 80%" />
        <IonSkeletonText animated style="width: 60%" />
      </SwiperSlide>
    </Swiper>
    <Swiper
      v-else
      :slides-per-view="3"
      :space-between="0"
      :slides-per-group="3"
      :pagination="true"
      :modules="modules"
    >
      <SwiperSlide v-for="ticker in tickers" :key="ticker.id">
        <div class="flex text-sm">
          <span class="text-white mr-1">{{ `${ticker.market.base_unit.toUpperCase()}/${publicStore.tickers[0].market.quote_unit.toUpperCase()}` }}</span>
          <span
            :class="[
              { 'text-down': parseFloat(ticker.price_change_percent) < 0 },
              { 'text-up': parseFloat(ticker.price_change_percent) >= 0 },
            ]"
          >
            {{ ticker.price_change_percent }}
          </span>
        </div>
        <div
          :class="[
            { 'text-down': parseFloat(ticker.price_change_percent) < 0 },
            { 'text-up': parseFloat(ticker.price_change_percent) >= 0 },
          ]"
        >
          {{ ticker.last }}
        </div>
        <div class="text-sm text-gray">
          ~ ${{ ticker.last }}
        </div>
      </SwiperSlide>
      <SwiperSlide class="h-full">
        <div class="swiper-slide-next flex justify-end">
          <div class="flex items-center text-white">
            <span class="text-gray mr-1">More</span>>>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style lang="less">
.page-home-market {
  .swiper {
    padding: 16px 0 16px 0;

    &-slide {
      padding: 0 16px;
    }

    &-pagination {
      bottom: 0;
    }
  }
}
</style>

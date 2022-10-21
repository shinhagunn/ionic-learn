<script setup lang="ts">
import type { AnimationBuilder } from '@ionic/vue'
import { createAnimation, useIonRouter } from '@ionic/vue'
import SearchLight from '~/components/icon/SearchLight.vue'
import Banner from '~/layouts/home/Banner.vue'
import FeatureMarkets from '~/layouts/home/FeatureMarkets.vue'
import TrendMarkets from '~/layouts/home/TrendMarkets.vue'
import UserDuotone from '~/components/icon/UserDuotone.vue'

const ionRouter = useIonRouter()
const publicStore = usePublicStore()

const userScreenAnimation: AnimationBuilder = (_, opts) => {
  return createAnimation()
    .addAnimation(createAnimation().addElement(opts.leavingEl).duration(200).fromTo('opacity', 1, 1))
    .addElement(opts.enteringEl)
    .duration(200)
    .keyframes([
      { offset: 0, transform: 'translate(-100%, 0)', opacity: 0.5 },
      { offset: 1, transform: 'translate(0, 0)', opacity: 1 },
    ])
}
</script>

<template>
  <IonPage class="page-home">
    <div class="page-home-head">
      <div class="page-home-head-user" @click="() => ionRouter.push('/screen/user', userScreenAnimation)">
        <UserDuotone />
      </div>
      <div class="page-home-head-search" @click="ionRouter.push('/screen/search')">
        <SearchLight />
        <span class="ml-2">Search</span>
      </div>
    </div>
    <IonContent>
      <VanPullRefresh :model-value="publicStore.loading" class="h-full" :disabled="publicStore.loading" @refresh="publicStore.FetchData">
        <Banner />
        <FeatureMarkets />
        <TrendMarkets />
      </VanPullRefresh>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.page-home {
  &-head {
    display: flex;
    align-items: center;
    padding: 8px;

    &-user {
      height: 28px;
      svg {
        margin-right: 16px;
        width: 28px;
        height: 28px;
      }

      .cls-1 {
        fill: @gray-color;
      }

      .cls-2 {
        fill: @placeholder-color;
      }
    }

    &-search {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 8px;
      background-color: rgba(@exchange-border-color, 0.5) !important;
      height: 24px;
      border-radius: 12px;
      color: @gray-color;

      svg {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }

      .cls-1 {
        fill: @gray-color;
      }
    }
  }
}
</style>

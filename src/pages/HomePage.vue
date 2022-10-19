<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import SearchLight from '~/components/icon/SearchLight.vue'
import Banner from '~/layouts/home/Banner.vue'
import FeatureMarkets from '~/layouts/home/FeatureMarkets.vue'
import TrendMarkets from '~/layouts/home/TrendMarkets.vue'
import UserDuotone from '~/components/icon/UserDuotone.vue'
const ionRouter = useIonRouter()
</script>

<template>
  <IonPage class="pages-home">
    <IonContent>
      <div class="pages-home-head">
        <div class="pages-home-head-user">
          <UserDuotone />
        </div>
        <div class="pages-home-head-search" @click="ionRouter.push('/search')">
          <SearchLight />
          <span class="ml-2">Search</span>
        </div>
      </div>
      <Banner />
      <FeatureMarkets />
      <TrendMarkets />
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.pages-home {
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

<script setup lang="ts">
import MarketList from '~/layouts/search-market/MarketList.vue'
import type { ZTabItem } from '~/types'

const activeTab = ref('top_gainers')

const tabs: ZTabItem[] = [
  {
    key: 'top_gainers',
    text: 'Top Gainers',
  },
  {
    key: 'top_losers',
    text: 'Top Losers',

  },
]
const publicStore = usePublicStore()

const topGainers = computed(() => [...publicStore.tickers].sort((a, b) => parseFloat(a.price_change_percent) - parseFloat(b.price_change_percent)).reverse().slice(0, 10))
const topLosers = computed(() => [...publicStore.tickers].sort((a, b) => parseFloat(a.price_change_percent) - parseFloat(b.price_change_percent)).slice(0, 10))
</script>

<template>
  <div class="page-home-tabs">
    <ZTab v-model="activeTab" :ink="false" :swiper="true" :tabs="tabs">
      <template #top_gainers>
        <MarketList :data-source="topGainers" />
      </template>
      <template #top_losers>
        <MarketList :data-source="topLosers" />
      </template>
    </ZTab>
  </div>
</template>

<style lang="less">
.page-home-tabs {
  .z-table {
    &-head {
      font-size: 12px;
    }

    &-row {
      line-height: normal;
      margin-bottom: 16px;
    }
  }

  .pair {
    color: @gray-color;
    font-size: 12px;
  }

  .price {
    color: @gray-color;
    font-size: 12px;
  }
}
</style>

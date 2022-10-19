<script setup lang="ts">
import MarketList from '~/layouts/search-market/MarketList.vue'
import SearchBar from '~/layouts/SearchBar.vue'
import config from '~/config'
import type { ZTabItem } from '~/types'

const search = ref('')

const publicStore = usePublicStore()
const activeTab = ref('favorites')

const tabs = computed(() => {
  const result: ZTabItem[] = [
    {
      key: 'favorites',
      text: 'Favorites',
    },
  ]

  config.quote_list.forEach((q) => {
    result.push({
      key: q,
      text: q.toUpperCase(),
    })
  })

  return result
})

const markets = computed(() => {
  const result: Record<string, Ticker[]> = {}

  for (const i in config.quote_list) {
    result[config.quote_list[i]] = publicStore.tickers.filter(t => t.market.quote_unit === config.quote_list[i])
  }

  return result
})
</script>

<template>
  <IonPage class="pages-markets">
    <IonContent :scroll-y="false">
      <SearchBar v-model="search" placeholder="Search Coin/Trades/..." />
      <ZTab v-model="activeTab" :swiper="true" :tabs="tabs">
        <template #favorites>
          <span class="block pt-2 text-2xl text-white">Hải Phòng là nhất</span>
        </template>
        <template v-for="quote in config.quote_list" :key="quote" #[quote]>
          <MarketList :data-source="markets[quote]" />
        </template>
      </ZTab>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.pages-markets {
  .z-tab-head-item {
    font-size: 14px;
  }
}
</style>

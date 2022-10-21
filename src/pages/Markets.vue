<script setup lang="ts">
import MarketList from '~/layouts/search-market/MarketList.vue'
import SearchLight from '~/components/icon/SearchLight.vue'
import config from '~/config'
import type { ZTabItem } from '~/types'

const publicStore = usePublicStore()
const tradeStore = useTradeStore()
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

  result.favorites = publicStore.tickers.filter(t => tradeStore.favorites.includes(t.id))

  return result
})
</script>

<template>
  <IonPage class="page-markets">
    <IonContent :scroll-y="false">
      <div class="p-[10px]">
        <RouterLink class="page-markets-search" to="/screen/search">
          <SearchLight />
          <span class="ml-2">Search</span>
        </RouterLink>
      </div>
      <ZTab v-model="activeTab" :swiper="true" :tabs="tabs">
        <template #favorites>
          <MarketList :data-source="markets.favorites" />
        </template>
        <template v-for="quote in config.quote_list" :key="quote" #[quote]>
          <MarketList :data-source="markets[quote]" />
        </template>
      </ZTab>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.page-markets {
  &-search {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 8px;
    background-color: rgba(@exchange-border-color, 0.5) !important;
    height: 24px;
    border-radius: 12px;
    color: @gray-color;
    text-decoration: none;

    svg {
      margin-right: 4px;
      width: 20px;
      height: 20px;
    }

    .cls-1 {
      fill: @gray-color;
    }
  }

  .z-tab-head-item {
    font-size: 14px;
  }
}
</style>

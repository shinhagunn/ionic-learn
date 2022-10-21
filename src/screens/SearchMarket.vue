<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import type { ZTableColumn } from '~/types'
import SearchBar from '~/layouts/SearchBar.vue'
import StarFilled from '~/components/icon/StarFilled.vue'

const ionRouter = useIonRouter()
const tradeStore = useTradeStore()
const publicStore = usePublicStore()
const search = ref('')

const columns: ZTableColumn[] = [
  {
    key: 'market',
    scopedSlots: true,
  },
  {
    key: 'price',
    scopedSlots: true,
    align: Align.Right,
  },
  {
    key: 'action',
    scopedSlots: true,
    align: Align.Right,
  },
]
</script>

<template>
  <IonPage class="screen-search-market">
    <IonContent>
      <SearchBar v-model="search" placeholder="Search Coin">
        <template #suffix>
          <span class="screen-search-market-back bold-text" @click="ionRouter.back()">Cancel</span>
        </template>
      </SearchBar>
      <ZTable :columns="columns" :data-source="publicStore.tickers" :search="search" :find-by="['market.base_unit', 'market.quote_unit', 'market.id', 'market.name']" :head-enabled="false">
        <template #market="{ item }">
          <div>
            <span class="text-white text-xl">{{ item.market.base_unit.toUpperCase() }}</span>
            <span>/{{ item.market.quote_unit.toUpperCase() }}</span>
          </div>
        </template>
        <template #price="{ item }">
          <div class="text-right">
            <span class="text-white text-xl">{{ item.last }}</span>
            <div
              :class="[
                { 'text-down': parseFloat(item.price_change_percent) < 0 },
                { 'text-up': parseFloat(item.price_change_percent) >= 0 },
              ]"
            >
              {{ item.price_change_percent }}
            </div>
          </div>
        </template>
        <template #action="{ item }">
          <div
            :class="{ 'action-active': tradeStore.favorites.includes(item.id) }"
            @click="tradeStore.ChangeFavorite(item.id)"
          >
            <StarFilled />
          </div>
        </template>
      </ZTable>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.screen-search-market {
  &-skeleton {
    padding-top: 12px;

    &-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0;
      padding: 0 8px;
      height: 32px;
    }
  }

  &-back {
    color: @primary-color;
    font-size: 14px;
  }

  .z-table {
    margin-top: 12px;

    &-row {
      line-height: normal;
      margin-bottom: 16px;
    }
  }

  .market {
    color: @gray-color;
    font-size: 12px;
  }

  .price {
    color: @gray-color;
  }

  .action {
    max-width: 40px;

    svg {
      width: 20px;
      height: 20px;
    }

    &-active {
      .cls-1 {
        fill: @primary-color;
      }
    }
  }

  .cls-1 {
    fill: @gray-color;
  }
}
</style>

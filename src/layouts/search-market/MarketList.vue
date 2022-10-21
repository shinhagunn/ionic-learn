<script setup lang="ts">
import type { ZTableColumn } from '~/types'
import StarFilled from '~/components/icon/StarFilled.vue'
withDefaults(defineProps<{
  dataSource: any[]
}>(), {
  dataSource: () => ([]),
})

const publicStore = usePublicStore()
const tradeStore = useTradeStore()

const columns: ZTableColumn[] = [
  {
    key: 'pair',
    title: 'Pair',
    scopedSlots: true,
  },
  {
    key: 'price',
    title: 'Price',
    scopedSlots: true,
    align: Align.Right,
  },
  {
    key: 'change',
    title: '(24h) Change',
    scopedSlots: true,
    align: Align.Right,
  },
]

const changeCurrencyToUSDT = (name: string) => {
  const currency = publicStore.currencies.find(c => c.id === name)
  if (currency) return currency.price
  return ''
}
</script>

<template>
  <div v-if="publicStore.loading" class="layouts-market-list-skeleton px-[12px]">
    <div class="layouts-market-list-skeleton-head">
      <div class="flex-1">
        Pair
      </div>
      <div class="flex-1 flex justify-end items-start">
        Price
      </div>
      <div class="flex-1 flex justify-end">
        (24h) Change
      </div>
    </div>
    <div v-for="item in 10" :key="item" class="layouts-market-list-skeleton-row">
      <div class="flex-1">
        <IonSkeletonText animated style="width: 70%;" />
        <IonSkeletonText animated style="width: 80%" />
      </div>
      <div class="flex-1 flex flex-col items-end">
        <IonSkeletonText animated style="width: 80%;" />
        <IonSkeletonText animated style="width: 50%;" />
      </div>
      <div class="flex-1 relative">
        <IonSkeletonText animated style="width: 70px; height: 28px; position: absolute; top: -19px; right: 0" />
      </div>
    </div>
  </div>
  <ZTable v-else class="layouts-market-list" :columns="columns" :data-source="dataSource">
    <template #pair="{ item }">
      <div>
        <span class="text-white text-xl">{{ item.market.base_unit.toUpperCase() }}</span>
        <span>/{{ item.market.quote_unit.toUpperCase() }}</span>
        <div class="flex items-center">
          <StarFilled v-if="tradeStore.favorites.includes(item.id)" />
          <span>Vol: {{ item.volume }}</span>
        </div>
      </div>
    </template>
    <template #price="{ item }">
      <div class="text-right">
        <span class="text-white text-xl">{{ item.last }}</span>
        <div>${{ changeCurrencyToUSDT(item.market.base_unit) }}</div>
      </div>
    </template>
    <template #change="{ item }">
      <div
        class="h-[28px] w-[70px] px-2 rounded flex items-center justify-center text-lg leading-normal"
        :class="[
          { 'bg-up': parseFloat(item.price_change_percent) >= 0 },
          { 'text-up': parseFloat(item.price_change_percent) >= 0 },
          { 'bg-down': parseFloat(item.price_change_percent) < 0 },
          { 'text-down': parseFloat(item.price_change_percent) < 0 },
        ]"
      >
        {{ item.price_change_percent }}
      </div>
    </template>
  </ZTable>
</template>

<style lang="less">
.layouts-market-list {
  &-skeleton {
    color: @gray-color;

    &-head {
      display: flex;
      align-items: center;
      width: 100%;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      display: flex;
    }

    &-row {
      display: flex;
      align-items: center;
      height: 32px;
      margin-bottom: 16px;
      line-height: normal;
    }
  }

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

    svg {
      width: 12px;
      height: 12px;
    }

    .cls-1 {
      fill: @primary-color;
    }
  }

  .price {
    color: @gray-color;
    font-size: 12px;
  }
}
</style>

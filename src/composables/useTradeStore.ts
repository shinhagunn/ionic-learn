import { acceptHMRUpdate, defineStore } from 'pinia'
import config from '~/config'
import type { OrderSide, OrderType } from '~/types'
// import ZNotification from '~/library/z-notification'
// import ZMessage from '~/library/z-message'

export const useTradeStore = defineStore({
  id: 'trade',
  state() {
    return {
      // exchange_layout: ref(config.default_exchange_layout),
      market_id: ref(config.default_market),
      chart_interval: ref(config.default_chart_interval),
      // chart_type: ref(config.default_chart_type),
      favorites: ref<string[]>([]),
      public_trades: {
        loading: ref(false),
        trades: reactive<PublicTrade[]>([]),
      },
    }
  },
  getters: {
    market(): Market {
      return usePublicStore().markets.find(market => market.id === this.market_id) as Market
    },
    ticker(): Ticker {
      return usePublicStore().tickers.find(ticker => ticker.id === this.market_id) as Ticker
    },
  },
  actions: {
    SetMarketID(marketID: string) {
      this.market_id = marketID
    },
    // SetExchangeLayout(exchangeLayout: ExchangeLayout) {
    //   this.exchange_layout = exchangeLayout
    // },
    SetChartInterval(chartInterval: string) {
      this.chart_interval = chartInterval
    },
    // SetChartType(chartType: ChartType) {
    //   this.chart_type = chartType
    // },
    ChangeFavorite(marketID: string) {
      const index = this.favorites.findIndex(m => m === marketID)

      if (index === -1) {
        this.favorites.push(marketID)
      } else {
        this.favorites.splice(index, 1)
      }
    },
    async FetchPublicTrades(marketID: string, limit = 100) {
      this.public_trades.loading = true
      this.public_trades.trades = []
      try {
        const { data } = await useBetterFetch<PublicTrade[]>(`trade/public/markets/${marketID}/trades?limit=${limit}`)
        this.public_trades.trades = data
      } catch (error) {
        return error
      } finally {
        this.public_trades.loading = false
      }
    },
    async GenerateWithdrawalCode(type: 'email' | 'phone', address: string, currency: string, blockchainKey: string, amount: number, callback?: () => void) {
      try {
        await useBetterFetch('trade/account/withdraws/generate_code', {
          body: { type, address, currency, amount, blockchain_key: blockchainKey },
          method: 'POST',
        })

        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async CreateWithdrawal(payload: { currency: string; amount: number; otp_code: string; email_code: string; phone_code?: string; address?: string; blockchain_key?: string; beneficiary_id?: number; note?: string }, callback?: (payload?: any) => void) {
      try {
        const { data } = await useBetterFetch<Withdraw>('trade/account/withdraws', {
          method: 'POST',
          body: payload,
        })

        if (callback) callback(data)
        return data
      } catch (error) {
        return {} as Withdraw
      }
    },
    FetchTrades(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Trade[]>('trade/market/trades', {
        params,
      })
    },
    FetchOrders(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Order[]>('trade/market/orders', {
        params,
      })
    },
    async PlaceOrder(payload: { market: string; stop_price?: string; price?: string; side: OrderSide; amount?: string; total?: string; type: OrderType }) {
      try {
        await useBetterFetch('trade/market/orders', {
          method: 'POST',
          body: payload,
        })
        // ZNotification.warn({
        //   title: $t('warning.title.order_placed'),
        //   description: $t('warning.description.order_placed'),
        // })
      } catch (error) {
        return error
      }
    },
    async CancelOrder(orderID: number) {
      try {
        await useBetterFetch(`trade/market/orders/${orderID}/cancel`, {
          method: 'POST',
        })
        // ZNotification.success({
        //   title: $t('success.title.order_cancelled'),
        //   description: $t('success.description.order_cancelled'),
        // })
      } catch (error) {
        return error
      }
    },
    async CancelAllOrders(marketID: string, side: OrderSide) {
      try {
        await useBetterFetch('trade/market/orders', {
          method: 'DELETE',
          body: {
            market: marketID,
            side,
          },
        })
      } catch (error) {
        return error
      }
    },
  },
  // persist: {
  //   paths: ['favorites', 'exchange_layout', 'chart_type', 'chart_interval', 'market_id'],
  // },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTradeStore, import.meta.hot))

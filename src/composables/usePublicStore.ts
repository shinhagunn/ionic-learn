import { acceptHMRUpdate, defineStore } from 'pinia'
import config from '~/config'

export const usePublicStore = defineStore({
  id: 'public',
  state() {
    return {
      markets: ref<Market[]>([]),
      currencies: ref<Currency[]>([]),
      withdraw_limits: ref<WithdrawLimit[]>([]),
      tickers: ref<Ticker[]>([]),
      sparklines: ref<Record<string, number[]>>({}),
      banners: ref<Banner[]>([]),
      headers: ref<Record<string, any>>(),
      currency_quote_price: ref(''),
      bannerLoading: ref(false),
      loading: ref(false),
    }
  },
  actions: {
    async FetchConfig() {
      try {
        const { data } = await useBetterFetch<{
          currency_quote_price: string
          markets: Market[]
          currencies: Currency[]
        }>('trade/public/config')

        this.currencies = data.currencies
        this.markets = data.markets.map((m) => {
          m.base_currency = data.currencies.find(c => c.id === m.base_unit) as Currency
          m.quote_currency = data.currencies.find(c => c.id === m.quote_unit) as Currency

          return m
        })
        this.currency_quote_price = data.currency_quote_price
      } catch (error) {
        return error
      }
    },
    async FetchTickers() {
      try {
        const res = await fetch(`${config.api.url}trade/public/tickers`)
        const data: Record<string, Ticker> = await res.json()

        for (const marketID in data) {
          const ticker = data[marketID]

          ticker.id = marketID
          ticker.market = this.markets.find(market => market.id === marketID) as Market
          this.tickers.push(ticker)
        }
      }
      catch (error) {
        return error
      }
    },
    async FetchBanners() {
      this.bannerLoading = true
      try {
        const { data } = await useBetterFetch<Banner[]>('kouda/public/banners')

        this.banners = data
      } catch (error) {
        return error
      } finally {
        this.bannerLoading = false
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePublicStore, import.meta.hot))

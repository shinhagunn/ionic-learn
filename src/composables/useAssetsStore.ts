import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Asset, DepositAddress } from '~/types'

export const useAssetsStore = defineStore({
  id: 'assets',
  state() {
    return {
      assets: ref<Asset[]>([]),
    }
  },
  getters: {
    spot_assets(): Asset[] {
      return this.assets
    },
  },
  actions: {
    async GetAllAssets() {
      try {
        const { data: assets } = await useBetterFetch<Asset[]>('trade/account/balances')

        assets.map((asset) => {
          asset.deposit_addresses = asset.deposit_addresses || []

          return asset
        })

        this.assets = assets
      } catch (error) {
        return error
      }
    },
    async FetchDepositAddress(currencyID: string, blockchainKey: string) {
      try {
        const { data } = await useBetterFetch<DepositAddress>(`trade/account/deposit_address/${currencyID}?network=${blockchainKey}`)
        const assets = this.assets

        assets.map((a) => {
          if (data.currencies.includes(a.currency)) {
            a.deposit_addresses.push(data)
          }

          return a
        })
      } catch (error) {
        return error
      }
    },
    FetchDeposits(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Deposit[]>('trade/account/deposits', {
        params,
      })
    },
    FetchWithdraws(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Withdraw[]>('trade/account/withdraws', {
        params,
      })
    },
    async FetchAssetStatistics(params: Record<string, any> = {}) {
      return useBetterFetch<AssetStatistic[]>('trade/account/asset_statistics', {
        params,
      })
    },
    async FetchPNLComulative(params: Record<string, any> = {}) {
      return useBetterFetch<PNLComulative[]>('trade/account/pnl_statistics/comulative', {
        params,
      })
    },
    async FetchPNLDaily(params: Record<string, any> = {}) {
      return useBetterFetch<PNLDaily[]>('trade/account/pnl_statistics/daily', {
        params,
      })
    },
    FetchPNLDistribution(params: Record<string, any> = {}) {
      return useBetterFetch<PNLDistribution>('trade/account/pnl_statistics/distribution', {
        params,
      })
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAssetsStore, import.meta.hot))

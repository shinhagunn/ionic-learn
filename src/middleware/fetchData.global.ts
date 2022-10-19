export const fetchDataMiddleware: Middleware = async () => {
  const publicStore = usePublicStore()

  publicStore.loading = true

  await publicStore.FetchConfig()
  await Promise.all([
    publicStore.FetchTickers(),
    publicStore.FetchBanners(),
  ])

  publicStore.loading = false
}

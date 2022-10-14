export const fetchDataMiddleware: Middleware = async () => {
  const publicStore = usePublicStore()

  await publicStore.FetchConfig()
  await Promise.all([
    publicStore.FetchTickers(),
    publicStore.FetchBanners(),
  ])
}

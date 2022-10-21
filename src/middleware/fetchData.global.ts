export const fetchDataMiddleware: Middleware = async () => {
  const publicStore = usePublicStore()

  await publicStore.FetchData()
}

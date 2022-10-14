import axios from 'axios'
import config from '~/config'

function jsonToParam(json: Record<string, any>, firstStr = '?') {
  const parts: string[] = []
  for (const i in json) {
    if (Object.prototype.hasOwnProperty.call(json, i) && json[i]) {
      const part = `${encodeURIComponent(i)}=${encodeURIComponent(json[i])}`
      parts.push(part)
    }
  }
  return parts.length ? firstStr + parts.join('&') : ''
}

const formatError = (error: any) => {
  // if (process.server) return

  const excludeErrors = ['resource.user.no_activity']

  const response = error.response
  const errors: string[] = response.data.errors
  // const userStore = useUserStore()

  // if (userStore.state === UserState.Active && response.status === 401 && !response.data?.errors?.includes('authz.invalid_permission')) {
  //   navigateTo('/')
  //   userStore.auth_error()
  // }

  for (const error of errors) {
    if (excludeErrors.includes(error)) {
      continue
    }

    switch (error) {
      default:
        // ZNotification.error({
        //   title: $t('error'),
        //   description: $t(error),
        // })
        break
    }
  }
}

const csrfHeaders = () => {
  const csrfToken = localStorage.getItem('csrf_token')
  const headers = { 'X-CSRF-Token': csrfToken }

  return csrfToken ? headers : {}
}

type BetterFetchBody = Record<string, any>

type BetterFetchHeaders = Record<string, string | number | string[]>

interface BetterFetchOptions {
  method?: 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: BetterFetchBody
  params?: Record<string, string | number>
  headers?: BetterFetchHeaders
}

export const useBetterFetch = async <T>(url: string, options?: BetterFetchOptions) => {
  try {
    let params = ''
    if (options?.params) {
      params = jsonToParam(options?.params)
    }

    const headers: Record<string, string> = {}
    // if (process.server) {
    //   const publicStore = usePublicStore()

    //   headers.cookie = publicStore.headers?.cookie || ''
    //   headers['user-agent'] = publicStore.headers?.['user-agent']
    // }

    if (options?.body && options.body === Object(options.body)) {
      for (const key in options.body) {
        if (options.body[key] === undefined) {
          delete options.body[key]
        } else if (typeof options.body[key] === 'string' && options.body[key].length === 0) {
          delete options.body[key]
        }
      }
    }

    const res = await axios.request<T>({
      withCredentials: true,
      url: config.api.url + url + params,
      data: options?.body,
      method: options?.method || 'GET',
      headers: {
        ...csrfHeaders(),
        ...options?.headers,
        ...headers,
      },
    })

    return res
  } catch (error) {
    formatError(error)

    return Promise.reject(error)
  }
}

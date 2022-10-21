import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ActivityResult, ActivityTopic, UserLabel, UserPhone } from '~/types'
import { UserLabelScope, UserState } from '~/types'
import ZMessage from '~/library/z-message'

export const useUserStore = defineStore({
  id: 'user',
  state() {
    return {
      _cache: reactive({
        email: '',
        email_code: '',
        phone_code: '' as string | undefined,
        otp_code: '',
      }),

      email: ref<string>(''),
      uid: ref<string>(''),
      level: ref<number>(0),
      state: ref<UserState>(),
      role: ref<string>(),
      group: ref<string>(),
      labels: ref<UserLabel[]>([]),
      withdraw_limit: ref<WithdrawLimit>(),
      otp: ref<boolean>(false),
      phone: ref<UserPhone>(),
      username: ref<string>(),

      beneficiaries: ref<Beneficiary[]>(),
      inviteLink: ref<InviteLink>({} as InviteLink),

      need_otp: ref<boolean>(),
      need_email: ref<boolean>(),
      need_phone: ref<boolean>(),
    }
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.state && this.state !== UserState.Loading
    },
    isPending(): boolean {
      return this.state === UserState.Pending
    },
    hasPhone(): boolean {
      const label = this.labels.find(l => l.key === 'phone')
      return label !== undefined && label.value === 'verified'
    },
    hasProfile(): boolean {
      const label = this.labels.find(l => l.key === 'profile')
      const states = ['pending', 'verified']
      return label !== undefined && states.includes(label.value)
    },
  },
  actions: {
    auth_loading() {
      this.state = UserState.Loading
    },
    auth_error() {
      this.state = undefined
      this.email = ''
      this.uid = ''
      this.role = undefined
      this.level = 0
      this.labels = []
      this.otp = false
      this.phone = undefined
      this.username = undefined

      localStorage.removeItem('csrf_token')
    },
    async auth_success(payload: any) {
      if (payload.state === UserState.Active && this.state !== payload.state) {
        await this.FetchData()
        // const websocketStore = useWebSocketStore()

        // websocketStore.subscribe(WebSocketType.Private, 'balance', 'order', 'trade')
        // websocketStore.connect(WebSocketType.Private)
        navigateTo('/')
      }

      this.state = payload.state
      this.email = payload.email
      this.uid = payload.uid
      this.role = payload.role
      this.level = payload.level
      this.labels = payload.labels || []
      this.otp = payload.otp
      this.phone = payload.phone
      this.username = payload.username

      this.need_otp = false
      this.need_phone = false
      this.need_email = false

      if (payload.csrf_token) localStorage.setItem('csrf_token', payload.csrf_token)

      if (this.isPending) {
        navigateTo('/screen/confirm-email')
      }
    },
    async FetchData() {
      const assetsStore = useAssetsStore()

      await Promise.all([
        assetsStore.GetAllAssets(),
        this.FetchBeneficiaries(),
        this.FetchInviteLinkDefault(),
        this.FetchTradeProfile(),
      ])
    },
    LoopGetLogged() {
      setTimeout(async () => {
        await this.GetLogged()
        if (this.state !== undefined) this.LoopGetLogged()
      }, 150000)
    },
    async GetLogged() {
      try {
        const { data } = await useBetterFetch('auth/resource/users/me')
        await this.auth_success(data)
      } catch (error) {
        this.auth_error()
        return error
      }
    },
    async FetchTradeProfile() {
      try {
        const { data } = await useBetterFetch<{ group: string; withdraw_limit: WithdrawLimit }>('trade/account/members/me')

        this.group = data.group
        this.withdraw_limit = data.withdraw_limit
      } catch (error) {
        return error
      }
    },
    async Login(email: string, password: string, codes: Record<string, string>) {
      this.auth_loading()
      try {
        const { data } = await useBetterFetch('auth/identity/sessions', {
          method: 'POST',
          body: {
            email,
            password,
            ...codes,
          },
        })
        if ((data as any).state === UserState.Active) {
          ZMessage({
            message: 'Login success',
          })
        } else {
          ZMessage({
            message: 'Must be confirm email',
          })
        }
        await this.auth_success(data)
        this.LoopGetLogged()
      } catch (error: any) {
        this.auth_error()

        if (error.response.status === 422) {
          const data: { errors: string[]; phone: boolean; otp: boolean } = error.response.data

          this._cache.email = email
          this.need_otp = data.otp
          this.need_phone = data.phone
          this.need_email = true
        }
      }
    },
    async GenerateCodeLogin(email: string, type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/identity/sessions/generate_code', {
          method: 'POST',
          body: { email, type },
        })
        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCodeResetPassword(email: string, type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/identity/users/password/generate_code', {
          method: 'POST',
          body: { email, type },
        })
        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCode(type: 'email' | 'phone', category: string, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/codes', {
          method: 'POST',
          body: { type, category },
        })
        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateChangePasswordCode(type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/users/password/generate_code', {
          method: 'POST',
          body: { type },
        })
        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCodeVerifyOTP(type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/otp/generate_code', {
          method: 'POST',
          body: { type },
        })

        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCodeUnbindOTP(type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/otp/disable/generate_code', {
          method: 'POST',
          body: { type },
        })

        // ZMessage.success({
        //   message: $t('success.sent_code', { type }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    GenerateQRCode() {
      return useBetterFetch<{
        url: string
      }>('auth/resource/otp/generate_qrcode', {
        method: 'POST',
      })
    },
    async Enable2FA(payload: { code: string; email_code: string; phone_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/otp/enable', {
          method: 'POST',
          body: payload,
        })
        this.otp = true
        this.level++
        // ZMessage.success({
        //   message: $t('success.2fa_enabled'),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async Disable2FA(payload: { code: string; email_code: string; phone_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/otp/disable', {
          method: 'POST',
          body: payload,
        })
        this.otp = false
        this.level--
        // ZMessage.success({
        //   message: $t('success.2fa_disabled'),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async Register(email: string, password: string, inviteCode: string) {
      this.auth_loading()
      try {
        const { data } = await useBetterFetch('auth/identity/users', {
          method: 'POST',
          body: {
            email,
            password,
            invite_code: inviteCode,
          },
        })
        await this.auth_success(data)
      } catch (error) {
        this.auth_error()
      }
    },
    async GenerateCodeConfirmEmail(email: string, callback?: () => void) {
      try {
        await useBetterFetch('auth/identity/users/email/generate_code', {
          method: 'POST',
          body: { email },
        })
        // ZMessage.success({
        //   message: $t('success.sent_code', { type: 'email' }),
        // })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async ConfirmEmail(email: string, code: string) {
      this.auth_loading()
      try {
        await useBetterFetch('auth/identity/users/email/confirm_code', {
          method: 'POST',
          body: { email, code },
        })
        this.state = UserState.Active
        await this.auth_success(this)
        // ZMessage.success({
        //   message: $t('success'),
        // })
        globalThis.location.replace('/')
      } catch (error) {
        this.state = undefined
        return error
      }
    },
    async ForgotPassword(email: string, type: string, callback?: (phone: boolean) => void) {
      try {
        const { data } = await useBetterFetch<{ phone: boolean }>('auth/identity/users/password/generate_code', {
          method: 'POST',
          body: { email, type },
        })
        if (callback) callback(data.phone)
        return data
      } catch (error) {
        return error
      }
    },
    async CheckCodeResetPassword(payload: { email: string; email_code: string; phone_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/identity/users/password/check_code', {
          method: 'POST',
          body: payload,
        })
        this._cache.email = payload.email
        this._cache.email_code = payload.email_code
        this._cache.phone_code = payload.phone_code

        navigateTo('/reset-password')

        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async ResetPassword(payload: { email: string; password: string; confirm_password: string; email_code: string; phone_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/identity/users/password/confirm_code', {
          method: 'POST',
          body: payload,
        })

        navigateTo('/login')

        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCodePhone(type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/phones/generate_code', {
          method: 'POST',
          body: { type },
        })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async GenerateCodeUnbindPhone(type: 'email' | 'phone', callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/phones/disable/generate_code', {
          method: 'POST',
          body: { type },
        })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async CreatePhone(payload: { phone_number: string; region: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/phones', {
          method: 'POST',
          body: payload,
        })
        this.phone = {
          id: 0,
          number: `+${payload.phone_number}`,
          region: payload.region,
          created_at: '',
          updated_at: '',
        }

        this.CreateUserLabel('phone', 'pending', UserLabelScope.Private)

        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async VerifyPhone(payload: { verification_code: string; email_code: string; otp_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/phones/verify', {
          method: 'POST',
          body: payload,
        })

        this.CreateUserLabel('phone', 'verified', UserLabelScope.Private)
        this.level++

        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async DisablePhone(payload: { phone_code: string; email_code: string; otp_code?: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/phones/disable', {
          method: 'POST',
          body: payload,
        })

        this.DeleteUserLabel('phone')
        this.level--

        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    CreateUserLabel(key: string, value: string, scope?: UserLabelScope.Private, description?: string) {
      const label = this.labels.find(label => label.key === key)
      if (!label) {
        this.labels.push({
          id: this.labels.length,
          key,
          value: key === 'phone' ? 'pending' : value,
          scope: scope as UserLabelScope,
          created_at: '',
          updated_at: '',
        })
      } else {
        label.value = value
        if (scope) label.scope = scope
        if (description) label.description = description
      }
    },
    DeleteUserLabel(key: string) {
      const index = this.labels.findIndex(label => label.key === key)
      if (index) {
        this.labels.splice(index, 1)
      }
    },
    async Logout() {
      try {
        await useBetterFetch('auth/identity/sessions', {
          method: 'DELETE',
        })
        this.auth_error()
        location.reload()
      } catch (error) {
        return error
      }
    },
    async AddProfile(payload: { full_name: string; country: string; document_type: string; document_number: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/kyc/profile', {
          method: 'POST',
          body: payload,
        })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    GetAPIKeys() {
      return useBetterFetch<{
        label: string
        kid: string
        scope: string
        state: string
        loading: boolean
      }[]>('auth/resource/api_keys', {
        method: 'GET',
      })
    },
    async CreateAPIKey(payload: { label: string; otp_code: string }, callback?: () => void) {
      const { data: apiKey } = await useBetterFetch<APIKey>('auth/resource/api_keys', {
        method: 'POST',
        body: payload,
      })
      if (callback) callback()
      return apiKey
    },
    async FetchBeneficiaries() {
      try {
        const { data } = await useBetterFetch<Beneficiary[]>('trade/account/beneficiaries')

        this.beneficiaries = data
      } catch (error) {
        return error
      }
    },
    async CreateBeneficiary(payload: Record<string, any>) {
      try {
        const { data } = await useBetterFetch<Beneficiary>('trade/account/beneficiaries', {
          method: 'POST',
          body: payload,
        })
        this.beneficiaries.push(data)
      } catch (error) {
        return error
      }
    },
    async DeleteBeneficiary(id: number) {
      try {
        await useBetterFetch(`trade/account/beneficiaries/${id}`, {
          method: 'DELETE',
        })
        const index = this.beneficiaries.findIndex(b => b.id === id)
        if (index !== -1) {
          this.beneficiaries.splice(index, 1)
        }
      } catch (error) {
        return error
      }
    },
    async AddAttachment(form: FormData) {
      try {
        await useBetterFetch('auth/resource/kyc/attachment', {
          headers: { 'Content-Type': 'multipart/form-data' },
          method: 'POST',
          body: form,
        })
      } catch (error) {
        return error
      }
    },
    async UpdateAPIKey(payload: { scope?: string; state: 'active' | 'disabled'; label: string; otp_code: string; kid: string }) {
      const { data: apiKey } = await useBetterFetch<APIKey>(`auth/resource/api_keys/${payload.kid}`, {
        method: 'PATCH',
        body: {
          state: payload.state,
          otp_code: payload.otp_code,
          label: payload.label,
        },
      })
      return apiKey
    },
    async SubmitProfile(callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/kyc/profile/submit', {
          method: 'POST',
        })
        this.CreateUserLabel('profile', 'pending')
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async UpdateStateAPIKey(payload: { state: string; kid: string }, callback?: () => void) {
      try {
        await useBetterFetch(`auth/resource/api_keys/${payload.kid}/state`, {
          method: 'PUT',
          body: {
            state: payload.state,
          },
        })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
    async DeleteAPIKey(payload: { otp_code: string; kid: string }) {
      try {
        await useBetterFetch(`auth/resource/api_keys/${payload.kid}`, {
          method: 'DELETE',
          body: {
            otp_code: payload.otp_code,
          },
        })
        return true
      } catch (error) {
        return false
      }
    },
    async SetNewPassword(payload: { old_password: string; new_password: string; confirm_password: string; otp_code: string; email_code: string; phone_code: string }, callback?: () => void) {
      try {
        await useBetterFetch('auth/resource/users/password', {
          method: 'PUT',
          body: payload,
        })
        if (callback) callback()
        return true
      } catch (error) {
        return false
      }
    },
    FetchActivity(topic: ActivityTopic, result: ActivityResult, limit = 100) {
      return useBetterFetch<Activity[]>(`auth/resource/users/activity/${topic}?result=${result}&limit=${limit}`)
    },
    FetchSessions() {
      return useBetterFetch<Device[]>('auth/resource/users/devices')
    },
    FetchInviteLinks(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<InviteLink[]>('trade/account/invite/links', {
        params,
      })
    },
    async CreateInviteLink(params: Record<string, any> = {}, callback?: () => void) {
      try {
        const { data } = await useBetterFetch<InviteLink>('trade/account/invite/links', {
          method: 'POST',
          body: params,
        })
        if (callback) callback()
        return data
      } catch (error) {
        return {} as InviteLink
      }
    },
    async UpdateInviteLink(inviteLink: InviteLink, params: Record<string, any> = {}, callback?: () => void) {
      try {
        await useBetterFetch('trade/account/invite/links', {
          method: 'PUT',
          body: params,
        })

        if (callback) callback()

        if (inviteLink.default) {
          this.inviteLink = inviteLink
        }
      } catch (error) {
        return error
      }
    },
    FetchInviteLists(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<InviteList[]>('trade/account/invite/list', {
        params,
      })
    },
    FetchCommissions(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Commission[]>('trade/account/invite/commissions', {
        params,
      })
    },
    FetchCashes(params: Record<string, any> = {}) {
      params.page ||= 1
      params.limit ||= 100

      return useBetterFetch<Commission[]>('trade/account/invite/cashes', {
        params,
      })
    },
    async FetchInviteLinkDefault() {
      try {
        const { data } = await useBetterFetch<InviteLink>('trade/account/invite/links/default')
        this.inviteLink = data
      } catch (error) {
        return error
      }
    },
    FetchTotalCommissionYesterday() {
      return useBetterFetch<string>('trade/account/invite/commissions/yesterday')
    },
    FetchTotalCashYesterday() {
      return useBetterFetch<string>('trade/account/invite/cashes/yesterday')
    },
    FetchTotalInvitedToday() {
      return useBetterFetch<number>('trade/account/invite/list/today')
    },
    FetchTotalInvited() {
      return useBetterFetch<number>('trade/account/invite/list/total')
    },
    FetchInviteOverview() {
      return useBetterFetch<InviteOverview>('trade/account/invite/overview')
    },
    FetchInviteOverviewYesterday() {
      return useBetterFetch<InviteOverview>('trade/account/invite/overview/yesterday')
    },
    async DestroySession(sessionID: string, callback?: () => void) {
      try {
        await useBetterFetch(`auth/resource/users/devices/${sessionID}`, {
          method: 'DELETE',
        })
        if (callback) callback()
      } catch (error) {
        return error
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))

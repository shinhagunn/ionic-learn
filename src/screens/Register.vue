<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import Validate from '~/validation/validate'
import TimesRegular from '~/components/icon/TimesRegular.vue'
import type { ZAuthFormField } from '~/types'

const ionRouter = useIonRouter()
const userStore = useUserStore()
const password = ref('')

const fields = computed(() => {
  return [
    {
      key: 'email',
      label: 'Email',
      name: 'email',
      type: InputType.Text,
      required: true,
      validate: [Validate.email],
      transformErrors: {
        'input.error.email': 'Email không đúng định dạng',
      },
    },
    {
      key: 'password',
      label: 'Mật khẩu',
      name: 'password',
      type: InputType.Password,
      required: true,
      value: password,
      validate: [Validate.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)],
      transformErrors: {
        'input.error.pattern': 'Mật khẩu không đúng định dạng',
      },
    },
    {
      key: 'confirm_password',
      label: 'Xác nhận mật khẩu',
      name: 'confirm_password',
      type: InputType.Password,
      required: true,
      validate: [Validate.equal(password.value)],
      transformErrors: {
        'input.error.pattern': 'Mật khẩu xác nhận không khớp',
      },
    },
    {
      key: 'invite_code',
      label: 'Mã mời',
      name: 'invite_code',
      type: InputType.Text,
    },
  ] as ZAuthFormField[]
})

const register = ({ email, password, invite_code: inviteCode }: { email: string; password: string; invite_code: string }) => {
  return userStore.Register(email, password, inviteCode)
}
</script>

<template>
  <IonPage class="screen-register">
    <IonContent>
      <div class="screen-register-head">
        <TimesRegular @click="ionRouter.back()" />
      </div>
      <div class="screen-register-content px-[20px]">
        <div class="screen-register-content-title bold-text text-white text-4xl py-14">
          Đăng ký ZSmartex
        </div>
        <ZAuthForm
          :loading="userStore.state === UserState.Loading"
          :fields="fields"
          @submit="register"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.screen-register {
  &-head {
    display: flex;
    justify-content: flex-end;
    padding: 12px;

    svg {
      width: 22px;
      height: 22px;
    }

    .cls-1 {
      fill: @gray-color;
    }
  }
}
</style>

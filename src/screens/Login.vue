<script setup lang="ts">
import type { AnimationBuilder } from '@ionic/vue'
import { createAnimation, useIonRouter } from '@ionic/vue'
import type { Ref } from 'vue'
import Validate from '~/validation/validate'
import TimesRegular from '~/components/icon/TimesRegular.vue'
import type { ZAuthFormField } from '~/types'
import ZButton from '~/components/ZButton.vue'

const ionRouter = useIonRouter()

const DelayButtonEmail = templateRef('delay-button-email') as unknown as Ref<InstanceType<typeof ZButton>>
const DelayButtonPhone = templateRef('delay-button-phone') as unknown as Ref<InstanceType<typeof ZButton>>

const userStore = useUserStore()

const fields = computed(() => {
  const needCode = userStore.need_otp || userStore.need_email || userStore.need_phone

  const fields = [
    {
      key: 'email',
      name: 'email',
      hidden: needCode,
      label: 'Email',
      type: InputType.Text,
      required: true,
      validate: [Validate.email],
      transformErrors: {
        'input.error.email': 'Email không đúng định dạng',
      },
    },
    {
      key: 'password',
      hidden: needCode,
      label: 'Mật khẩu',
      name: 'password',
      type: InputType.Password,
      required: true,
      validate: [Validate.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)],
      transformErrors: {
        'input.error.pattern': 'Mật khẩu không đúng định dạng',
      },
    },
    {
      key: 'email_code',
      name: 'email_code',
      type: InputType.Number,
      hidden: !userStore.need_email,
      label: 'Email Code',
      required: userStore.need_email,
      maxLength: 6,
      validate: [Validate.minLength(6)],
      transformErrors: {
        'input.error.min_length': 'Số lượng kí tự chưa phù hợp',
      },
    },
    {
      key: 'phone_code',
      name: 'phone_code',
      type: InputType.Number,
      hidden: !userStore.need_phone,
      label: 'Phone Code',
      required: userStore.need_phone,
      maxLength: 6,
      validate: [Validate.minLength(6)],
      transformErrors: {
        'input.error.min_length': 'Số lượng kí tự chưa phù hợp',
      },
    },
    {
      key: 'otp_code',
      name: 'otp_code',
      type: InputType.Number,
      hidden: !userStore.need_otp,
      label: 'OTP Code',
      required: userStore.need_otp,
      maxLength: 6,
      validate: [Validate.minLength(6)],
      transformErrors: {
        'input.error.min_length': 'Số lượng kí tự chưa phù hợp',
      },
    },
  ] as ZAuthFormField[]

  return fields
})

const leavingAnimation: AnimationBuilder = (_, opts) => {
  return createAnimation()
    .addAnimation(createAnimation().addElement(opts.enteringEl).duration(200).fromTo('opacity', 1, 1))
    .addElement(opts.leavingEl)
    .duration(200)
    .keyframes([
      { offset: 0, transform: 'translate(0, 0)', opacity: 1 },
      { offset: 1, transform: 'translate(0, 100%)', opacity: 0.3 },
    ])
}

const GenerateLoginCode = (type: 'email' | 'phone') => {
  let button: Ref<InstanceType<typeof ZButton>>
  if (type === 'email') {
    button = DelayButtonEmail
  } else {
    button = DelayButtonPhone
  }

  userStore.GenerateCodeLogin(userStore._cache.email, type, button.value.StartDelay)
}

watch(() => userStore.need_email, async (needEmail) => {
  await nextTick()
  if (needEmail) GenerateLoginCode('email')
})

onBeforeUnmount(() => {
  userStore.need_otp = false
  userStore.need_email = false
  userStore.need_phone = false
})

const login = async ({ email, password, email_code: emailCode, otp_code: OTPCode, phone_code: phoneCode }: { email: string; password: string; email_code: string; phone_code: string; otp_code: string }) => {
  await userStore.Login(email, password, {
    email_code: emailCode,
    phone_code: phoneCode,
    otp_code: OTPCode,
  })
}
</script>

<template>
  <IonPage class="screen-login">
    <IonContent>
      <div class="screen-login-head">
        <TimesRegular @click="ionRouter.back(leavingAnimation)" />
      </div>
      <div class="screen-login-content px-[20px]">
        <div class="screen-login-content-title bold-text text-white text-4xl py-14">
          Đăng nhập ZSmartex
        </div>
        <ZAuthForm
          :loading="userStore.state === UserState.Loading"
          :fields="fields"
          @submit="login"
        >
          <template #email_code-suffix>
            <ZButton
              ref="delay-button-email"
              :delay="{
                time: 60,
                content: 'Get [#{time}] again',
              }"
              @click="GenerateLoginCode('email')"
            >
              Get Code
            </ZButton>
          </template>
          <template #phone_code-suffix>
            <ZButton
              ref="delay-button-phone"
              :delay="{
                time: 60,
                content: 'Get [#{time}] again',
              }"
              @click="GenerateLoginCode('phone')"
            >
              Get Code
            </ZButton>
          </template>
          <div class="mt-16">
            <!-- <RouterLink to="/forgot-password" class="bold-text screen-login-link">
              Forgot Password
            </RouterLink> -->
            <RouterLink to="/screen/register" class="bold-text screen-login-link">
              Tạo tài khoản ZSmartex
            </RouterLink>
          </div>
        </ZAuthForm>
      </div>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.screen-login {
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

  &-link {
    color: @primary-color;
    font-size: 14px;
  }
}
</style>

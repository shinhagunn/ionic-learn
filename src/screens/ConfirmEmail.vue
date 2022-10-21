<script setup lang="ts">
import type { AnimationBuilder } from '@ionic/vue'
import { createAnimation, useIonRouter } from '@ionic/vue'
import Validate from '~/validation/validate'
import TimesRegular from '~/components/icon/TimesRegular.vue'
import type { ZAuthFormField } from '~/types'
import { Ref } from 'vue'
import ZButton from '~/components/ZButton.vue'

const userStore = useUserStore()
const ionRouter = useIonRouter()
const DelayButton = templateRef('delay-button') as unknown as Ref<InstanceType<typeof ZButton>>

const generateCode = () => {
  userStore.GenerateCodeConfirmEmail(userStore.email, DelayButton.value.StartDelay)
}

onMounted(() => {
  generateCode()
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

const fields: ZAuthFormField[] = [
  {
    key: 'code',
    name: 'code',
    type: InputType.Text,
    label: 'Email Code',
    required: true,
    maxLength: 6,
    validate: [Validate.minLength(6)],
    transformErrors: {
      'input.error.min_length': 'Số lượng kí tự chưa đúng',
    },
  },
]

const confirmEmail = ({ code }: { code: string }) => {
  userStore.ConfirmEmail(userStore.email || '', code)
}
</script>

<template>
  <IonPage class="screen-confirm-email">
    <IonContent>
      <div class="screen-confirm-email-head">
        <TimesRegular @click="ionRouter.back(leavingAnimation)" />
      </div>
      <div class="screen-confirm-email-content px-[20px]">
        <div class="screen-confirm-email-content-title bold-text text-white text-4xl py-14">
          Xác minh Email Code
        </div>
        <ZAuthForm
          :fields="fields"
          :loading="userStore.state === UserState.Loading"
          @submit="confirmEmail"
        >
          <template #code-suffix>
            <ZButton
              ref="delay-button"
              :delay="{
                time: 60,
                content: 'Get [#{time}] again',
              }"
              @click="generateCode()"
            >
              Get Code
            </ZButton>
          </template>
        </ZAuthForm>
      </div>
    </IonContent>
  </IonPage>
</template>

<style lang="less">
.screen-confirm-email {
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

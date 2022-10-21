<script setup lang="ts">
import type { ZAuthFormField } from '~/types'

const props = withDefaults(defineProps<{
  title?: string
  loading?: boolean
  submitText?: string
  fields: ZAuthFormField[]
}>(), {
  fields: () => [],
})

const emit = defineEmits(['submit'])
const values = ref<Record<string, string>>({})

const buttonDisabled = computed(() => {
  for (const field of props.fields) {
    if (!values.value[field.key] && field.required) {
      return true
    }

    if (!field.validate) {
      continue
    }

    for (const validate of field.validate) {
      if (validate(values.value[field.name]) && values.value[field.name]) {
        return true
      }
    }
  }

  return false
})

onMounted(() => {
  for (const field of props.fields) {
    values.value[field.name] = field.value?.value || ''
  }
})

watch(values.value, () => {
  for (const field of props.fields) {
    if (field.value) {
      field.value.value = values.value[field.name]
    }
  }
})

const onSubmit = () => {
  emit('submit', values.value)
}
</script>

<template>
  <div class="z-auth-form">
    <ZForm class="z-form" @submit.prevent="onSubmit">
      <template v-for="field in fields" :key="field.key">
        <ZAuthInput
          v-if="!field.hidden"
          v-model="values[field.key]"
          :name="field.name"
          :type="field.type"
          :label="field.label"
          :placeholder="field.placeholder"
          :max-length="field.maxLength"
          :validate="field.validate"
          :transform-errors="field.transformErrors"
          :class="field.class"
          :style="field.styles"
        >
          <template v-if="!field.hidden && $slots[`${field.key}-suffix`]" #suffix>
            <slot :name="`${field.key}-suffix`" />
          </template>
        </ZAuthInput>
      </template>
      <ZAuthButton type="submit" :loading="loading" :disabled="buttonDisabled">
        {{ submitText || 'Submit' }}
      </ZAuthButton>
      <slot />
    </ZForm>
  </div>
</template>

<style lang="less">
.z-auth-form {
  width: 100%;

  .z-form {
    .z-auth-input {
      margin-top: 30px;

      &:first-child {
        margin-top: 0;
      }
    }

    .z-auth-button {
      width: 100%;
      margin: 30px 0;
    }
  }
}
</style>

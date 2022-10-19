<script setup lang="ts">
import SearchLight from '~/components/icon/SearchLight.vue'
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const search = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="layouts-search-bar">
    <div v-if="$slots.prefix" class="pr-[8px]">
      <slot name="prefix" />
    </div>
    <ZInput v-model="search" :type="InputType.Text" :placeholder="placeholder">
      <template #prefix>
        <SearchLight />
      </template>
    </ZInput>
    <div class="pl-[8px]">
      <slot name="suffix" />
    </div>
  </div>
</template>

<style lang="less">
.layouts-search-bar {
  display: flex;
  align-items: center;
  padding: 8px;

  .z-input {
    flex: 1;
    height: 32px;
    background-color: rgba(@exchange-border-color, 0.5);
    border-radius: 12px;

    &-prefix {
      display: flex;
      align-items: center;
      svg {
        margin-right: 4px;
        width: 20px;
        height: 20px;
      }
    }
  }

  .cls-1 {
    fill: @gray-color;
  }
}
</style>

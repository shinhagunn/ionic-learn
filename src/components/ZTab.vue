<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperCore from 'swiper'
import type { ZTabItem } from '~/types'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const props = withDefaults(defineProps<{
  tabs: ZTabItem[]
  modelValue: string
  ink?: boolean
  swiper?: boolean
}>(), {
  ink: true,
  swiper: false,
})

const emit = defineEmits(['update:modelValue', 'click'])

const instance = getCurrentInstance()
const activeTab = useVModel(props, 'modelValue', emit)
const bouding = ref<DOMRect>()
const tabBouding = ref<DOMRect>()
const swiperRef = ref<SwiperCore>()
const slots = useSlots()
const keys = Object.keys(slots) // ['tab', 'panel']
const headElement = templateRef<HTMLElement>('head')
const scrollLeft = ref(0)

const tabElement = useCurrentElement()

const activeTabElement = () => {
  const elements = instance?.refs[`tab-${activeTab.value}`] as Element[]

  return elements[0]
}

onMounted(async () => {
  while (true) {
    const rect = activeTabElement().getBoundingClientRect()
    if (Object.values(JSON.parse(JSON.stringify(rect))).reduce((a: any, b: any) => a + b, 0) === 0) {
      // eslint-disable-next-line promise/param-names
      await new Promise(r => setTimeout(r, 10))
      continue
    }

    tabBouding.value = tabElement.value.getBoundingClientRect()
    bouding.value = rect
    break
  }
})

const reloadBouding = () => {
  bouding.value = activeTabElement().getBoundingClientRect()
  scrollLeft.value = headElement.value!.scrollLeft
}

const onClick = async (e: MouseEvent, tab: ZTabItem) => {
  activeTab.value = tab.key
  await nextTick()
  reloadBouding()

  const index = keys.findIndex(k => k === activeTab.value)
  if (index !== -1) {
    swiperRef?.value?.slideTo(index)
  }
}

const onSlideChange = async () => {
  if (swiperRef.value) {
    activeTab.value = keys[swiperRef.value.activeIndex]
    await nextTick()
    reloadBouding()
    if (bouding.value!.right + 12 > tabElement.value.scrollWidth) {
      headElement.value.scrollTo({
        top: 0,
        left: bouding.value!.right - tabElement.value.scrollWidth + 12 + scrollLeft.value,
        behavior: 'smooth',
      })
    } else if (bouding.value!.x < 12) {
      headElement.value.scrollTo({
        top: 0,
        left: Math.max(headElement.value.scrollLeft + bouding.value!.x - 12, 0),
        behavior: 'smooth',
      })
    }
  }
}
</script>

<template>
  <div class="z-tab">
    <div ref="head" class="z-tab-head">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.key"
        :ref="`tab-${tab.key}`"
        class="z-tab-head-item"
        :class="[{ 'z-tab-head-item-active': activeTab === tab.key, 'mr-0': index === tabs.length - 1 }]"
        @click="(e) => onClick(e, tab)"
      >
        <slot v-if="tab.slotName" :name="tab.key" />
        <span v-else>{{ tab.text }}</span>
      </div>
      <div
        v-if="bouding && tabBouding && ink"
        class="z-tab-head-ink"
        :style="{
          left: `${scrollLeft + bouding.x - tabBouding.x}px`,
          top: `${bouding.height - 2}px`,
          width: `${bouding.width}px`,
        }"
      />
    </div>
    <Swiper
      v-if="swiper"
      :slides-per-view="1"
      :space-between="0"
      :free-mode="false"
      :resistance-ratio="0"
      @swiper="swiper => swiperRef = swiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="tab in tabs" :key="tab.key">
        <slot :name="tab.key" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style lang="less">
.z-tab {
  height: 100%;

  &-head {
    display: flex;
    position: relative;
    padding: 0 12px;
    height: 32px;
    user-select: none;
    overflow-x: scroll;

    &-item {
      display: flex;
      align-items: center;
      height: 100%;
      margin: 0 12px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 12px;
      color: @gray-color;

      &:first-child {
        margin-left: 0;
      }

      &-active {
        color: @primary-color;
      }
    }

    &-ink {
      position: absolute;
      display: block;
      height: 2px;
      background-color: @primary-color;
      transition: transform .3s cubic-bezier(.645,.045,.355,1),width .2s cubic-bezier(.645,.045,.355,1),left .3s cubic-bezier(.645,.045,.355,1);
    }
  }

  .swiper {
    height: 100%;
  }
}
</style>

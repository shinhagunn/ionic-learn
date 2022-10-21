<script setup lang="ts">
import { format as formatDate, fromUnixTime, parseISO } from 'date-fns'
import { ChangePercentToClass, FindBy, SideToClass } from '~/mixins'
import type { ZTableColumn } from '~/types'
import { ParseType, SortBy } from '~/types'

const props = withDefaults(defineProps<{
  loading?: boolean
  columns: ZTableColumn[]
  headEnabled?: boolean
  dataSource: any[] | null
  border?: boolean
  pagination?: boolean
  page?: number
  pageSize?: number
  scroll?: boolean
  hover?: boolean
  allowSortData?: boolean
  query?: Record<string, string | number | string[]>
  isRouterLink?: boolean
  routerBuilder?: string
  selectedIndex?: number
  search?: string
  findBy?: string[]
}>(), {
  columns: () => [] as ZTableColumn[],
  dataSource: () => [] as any[],
  selectedIndex: -1,
  headEnabled: true,
  allowSortData: true,
  query: () => ({}),
})

const emit = defineEmits(['click', 'scrollBottom', 'sort'])

const instance = getCurrentInstance()

enum SortKind {
  Desc = 'desc',
  Asc = 'asc',
  None = 'none',
}

const sortKey = computed(() => {
  return props.query.order_by ? (props.query.order_by as string).replace('.keyword', '') : ''
})

const sortKind = computed(() => {
  return props.query.ordering === 'asc' ? SortKind.Asc : props.query.ordering === 'desc' ? SortKind.Desc : SortKind.None
})

const sortBy = computed(() => {
  const column = props.columns.find(column => column.key === sortKey.value)

  if (column) {
    return column.sortBy
  }
})

const isSort = computed(() => {
  for (const column of props.columns) {
    if (column.sort) return true
  }

  return false
})

const isEmpty = computed(() => {
  return props.dataSource?.length === 0
})

const dataFilter = computed(() => {
  if (!props.dataSource) return []
  if (props.search && props.findBy) return FindBy(props.dataSource, props.findBy, props.search)
  if (!sortKey.value) return props.dataSource
  if (sortKind.value === SortKind.None) return props.dataSource
  if (!props.allowSortData) return props.dataSource

  const data = [...props.dataSource]
  const sKey = sortKey.value

  data.sort((a: any, b: any) => {
    const AValue = getValueByKey(sKey, a)
    const BValue = getValueByKey(sKey, b)

    if (sortBy.value === SortBy.Number) {
      return parseFloat(AValue) - parseFloat(BValue)
    } else if (sortBy.value === SortBy.String) {
      return AValue.localeCompare(BValue)
    } else {
      return new Date(AValue).getTime() - new Date(BValue).getTime()
    }
  })

  return sortKind.value === SortKind.Desc ? data.reverse() : data
})

const indexSelected = computed(() => {
  if (isEmpty.value) return -1
  if (props.selectedIndex === -1) return -1

  const itemSelected = dataFilter.value[props.selectedIndex]

  for (let index = 0; index < dataFilter.value.length; index++) {
    const item = dataFilter.value[index]

    const eq = Object.is(itemSelected, item)

    if (eq) return index
  }
})

function routerLink(item: any) {
  if (!props.isRouterLink) return
  if (!props.routerBuilder) return
  let routerBuilder = props.routerBuilder

  let startIndex = 0
  for (let i = 0; i < routerBuilder.length; i++) {
    const str = routerBuilder[i]
    if (str === '#') {
      startIndex = i
      continue
    }
    if (str === '}') {
      const param = routerBuilder.slice(startIndex, i + 1)
      let paramKey = param.replace(/#\{|\}/gi, '')

      const toUpper = paramKey.includes('toUpper')
      const toLower = paramKey.includes('toLower')

      if (toUpper) {
        paramKey = paramKey.replace('.toUpper', '')
      }
      else if (toLower) {
        paramKey = paramKey.replace('.toLower', '')
      }

      let value = getValueByKey(paramKey, item)
      if (toUpper) {
        value = value.toUpperCase()
      }
      else if (toLower) {
        value = value.toLowerCase()
      }

      routerBuilder = routerBuilder.replace(param, value)
      i = 0
      continue
    }
  }

  return routerBuilder
}

function setSortKey(key: string) {
  const column = props.columns.find(column => column.key === key)
  if (!column?.sort) {
    return
  }

  const currentKey = sortKey.value
  let newKey = key
  let newKind = sortKind.value

  if (currentKey !== key) {
    newKind = SortKind.Asc
    emit('sort', column.sortKeyword ? `${key}.keyword` : key, newKind)
    return
  }

  if (newKind === SortKind.None) {
    newKind = SortKind.Asc
  } else if (newKind === SortKind.Asc) {
    newKind = SortKind.Desc
  } else {
    newKey = ''
    newKind = SortKind.None
  }

  emit('sort', column.sortKeyword && newKey !== '' ? `${newKey}.keyword` : newKey, newKind)
}

function sideToClass(key: string, item: any) {
  return SideToClass(item[key])
}

function changePercentToClass(key: string, item: any) {
  return ChangePercentToClass(item[key])
}

function getValueByKey(key: string, item: any, parse?: ParseType, precision?: ZTableColumn['precision']) {
  const column = props.columns.find(column => column.key === key)

  let value

  if (key.includes('.')) {
    const keys = key.split('.')
    let inv: any = null

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]

      if (index === 0) {
        inv = item[key]
      }
      else {
        inv = inv[key]
      }
    }

    value = inv
  } else {
    value = item[key]
  }

  if (parse === ParseType.Decimal) {
    const vprecision = typeof precision === 'function' ? precision(item) : precision

    value = Number(value)
    if (value === 0) {
      value = '--'
    } else if (vprecision !== undefined && vprecision !== null) {
      value = (value as number).toLocaleString('en-US', { minimumFractionDigits: vprecision, maximumFractionDigits: vprecision })
    }
  } else if (parse === ParseType.Time || parse === ParseType.DateTime) {
    switch (typeof value) {
      case 'number':
        value = fromUnixTime(value)
        break
      case 'string':
        value = parseISO(value)
        break
      default:
        break
    }
  }

  if (column?.prefix) {
    const vprefix = typeof column.prefix === 'function' ? column.prefix(item) : column.prefix

    value = `${vprefix} ${value}`
  }

  if (column?.suffix) {
    const vsuffix = typeof column.suffix === 'function' ? column.suffix(item) : column.suffix

    value = `${value} ${vsuffix}`
  }

  return value
}

onMounted(() => {
  const content = instance?.proxy?.$refs.content as HTMLElement

  content.addEventListener('scroll', () => {
    if (content.scrollTop + content.clientHeight >= content.scrollHeight) {
      emit('scrollBottom')
    }
  })
})
</script>

<template>
  <div
    class="z-table" :class="[
      {
        'z-table-loading': loading,
        'z-table-scrollable': scroll,
        'z-table-hoverable': hover,
        'z-table-headable': headEnabled,
        'z-table-sortable': isSort,
      },
    ]"
  >
    <div v-if="headEnabled" class="z-table-head">
      <template v-for="column in columns">
        <span v-if="!column.hideColumn" :key="column.key" :class="[column.key, column.class, `text-${column.align || 'left'}`]">
          <span :class="{ 'z-table-head-sortable': column.sort }" @click="setSortKey(column.key)">
            <template v-if="column.headScopedSlots">
              <slot :name="`head.${column.key}`" />
            </template>
            <template v-else>
              {{ column.title }}
            </template>
          </span>
        </span>
      </template>
    </div>
    <div ref="content" class="z-table-content" :class="{ 'min-h-[200px]': loading }">
      <div v-if="isEmpty" class="z-table-empty w-full h-full flex flex-col items-center justify-center">
        <!-- <ZIcon type="print" /> -->
        Empty
      </div>
      <ZTableRow v-for="(item, index) in dataFilter" :key="index" :selected="indexSelected === index" :is-router-link="isRouterLink" :to="routerLink(item)" @click="emit('click', item)">
        <template v-for="(column) in columns" :key="column.key">
          <span
            class="z-table-row-col" :class="[
              `z-table-row-col-align-${column.align || 'left'}`,
              column.key.split('.')[column.key.split('.').length - 1],
              column.class,
              {
                [sideToClass(column.sideKey as string, item)]: column.sideKey && column.formatBy === 'price',
              },
              {
                [changePercentToClass(column.sideKey as string, item)]: column.sideKey && column.formatBy === 'change',
              },
            ]"
          >
            <slot
              v-if="column.scopedSlots"
              :name="column.key"
              :item="item"
              :column="column"
            />
            <span v-else class="z-table-row-col-content">
              <template v-if="column.formatBy === 'datetime'">
                {{ getValueByKey(column.key, item, column.parse) ? formatDate(getValueByKey(column.key, item, column.parse), "yyyy-MM-dd HH:mm:ss") : '--' }}
              </template>
              <template v-else-if="column.formatBy === 'datetime-no-year'">
                {{ getValueByKey(column.key, item, column.parse) ? formatDate(getValueByKey(column.key, item, column.parse), "MM-dd HH:mm:ss") : '--' }}
              </template>
              <template v-else-if="column.formatBy === 'time'">
                {{ getValueByKey(column.key, item, column.parse) ? formatDate(getValueByKey(column.key, item, column.parse), "HH:mm:ss") : '--' }}
              </template>
              <template v-else-if="column.toUpper">
                {{ getValueByKey(column.key, item, column.parse).toUpperCase() }}
              </template>
              <template v-else-if="column.toLower">
                {{ getValueByKey(column.key, item, column.parse).toLowerCase() }}
              </template>
              <template v-else>
                {{ getValueByKey(column.key, item, column.parse, column.precision) }}
              </template>
            </span>
          </span>
        </template>
      </ZTableRow>
      <div v-if="$slots.foot" class="z-table-content-footer">
        <slot name="foot" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.z-table {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;

  &-empty {
    color: @gray-color;
    font-size: 16px;

    i {
      font-size: 100px;
    }
  }

  &-hoverable &-row {
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &-scrollable {
    .z-table-head {
      position: absolute;

      & + .z-table-content {
        top: 32px;
        height: calc(100% - 32px);
      }
    }

    .z-table-content {
      position: absolute;
      top: 0;
      overflow-y: auto;
      height: 100%;
    }
  }

  &-head {
    position: relative;
    color: @gray-color;
    user-select: none;

    &-sortable {
      position: relative;
      padding-right: 16px;
      cursor: pointer;
    }

    &-sort-caret {
      position: absolute;
      right: -4px;
      top: 0;
      height: 32px;
      font-size: 9px;

      > i {
        position: absolute;
        transform: translateX(-100%) scale(.5);
        opacity: 0.5;
        font-size: 18px;

        &.active {
          opacity: 1;
          color: @action-color;
        }
      }

      .up {
        top: -4px;
      }

      .down {
        bottom: 10px;
      }
    }
  }

  &-scrollable &-head, &-scrollable &-row {
    padding-right: 11px;
  }

  &-sortable&-scrollable &-head {
    padding-right: 5px;
  }

  &-content {
    position: relative;
    width: 100%;
  }

  &-head, &-row {
    display: flex;
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    height: 32px;
    line-height: 32px;

    > span {
      flex: 1;
    }
  }

  &-row {
    position: relative;

    &-selected {
      background-color: @active-background-color;
    }

    &-col {
      display: flex;
      align-items: center;

      &-align-left {
        justify-content: start;
      }

      &-align-center {
        justify-content: center;
      }

      &-align-right {
        justify-content: end;
      }

      &-content {
        display: flex;
        align-items: center;
        height: 100%;
      }
    }
  }

  a.z-table-row {
    color: inherit;

    &:hover {
      color: inherit;
    }
  }
}
</style>

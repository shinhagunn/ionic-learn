<script setup lang="ts">
import { useQueryProvider } from 'vue-query'
import ZMessage from '~/library/z-message'

useQueryProvider()

onMounted(() => {
  ZMessage({
    message: 'Hello Message top',
    duration: 3000000,
    placement: MessagePlacement.Top,
  })

  ZMessage({
    message: 'Hello Message middle',
    duration: 3000000,
    placement: MessagePlacement.Middle,
  })

  ZMessage({
    message: 'Hello Message 1',
    duration: 3000000,
  })

  setTimeout(() => {
  ZMessage({
    message: 'Hello Message top 2',
    duration: 3000000,
    placement: MessagePlacement.Top,
  })
    ZMessage({
    message: 'Hello Message 2',
    duration: 3000000,
  })
  }, 2000);
})
</script>

<template>
  <IonApp>
    <IonRouterOutlet />
    <ZMessageGroup />
  </IonApp>
</template>

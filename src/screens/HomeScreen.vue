<script setup lang="ts">
import {
	IonIcon, 
  IonLabel, 
  IonPage,
  IonTabBar, 
  IonTabButton, 
  IonTabs,
  IonRouterOutlet,
} from '@ionic/vue'
import { calendar } from 'ionicons/icons';
import HomeDashDuotone from '@/components/icon/HomeDashDuotone.vue';
import ExchangeDuotone from '@/components/icon/ExchangeDuotone.vue';
import WalletDuotone from '@/components/icon/WalletDuotone.vue';
import ChartBarDuotone from '@/components/icon/ChartBarDuotone.vue';
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="tabbar">
        <ion-tab-button tab="tab1" class="tabbar-item" href="/t/home">
          <HomeDashDuotone />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" class="tabbar-item" href="/t/markets">
          <ChartBarDuotone />
          <ion-label>Markets</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" class="tabbar-item" href="/t/trade">
          <ExchangeDuotone />
          <ion-label>Trade</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" class="tabbar-item" href="/t/wallet">
          <WalletDuotone />
          <ion-label>Wallet</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style lang="less">
.tabbar {
  background-color: #20283c !important;

  &::before, &::after {
    content: none;
  }

  &-item {
    background-color: #20283c !important;
  }

  .tab-selected {
    color: @primary-color;

    .cls-1 {
      fill: #0095ff;
    }

    .cls-2 {
      fill: #88b4e6;
    }
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .cls-1 {
    fill: rgba(#9eaed6, 0.75);
    transition: all 0.3s;
  }

  .cls-2 {
    fill: #515c7a;
    transition: all 0.3s;
  }
}
</style>

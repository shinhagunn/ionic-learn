<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="tabbar">
        <IonTabButton tab="tab1" class="tabbar-item" href="/t/home">
          <IconHomeDashDuotone />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab2" class="tabbar-item" href="/t/markets">
          <IconChartBarDuotone />
          <IonLabel>Markets</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab3" class="tabbar-item" href="/t/trade">
          <IconExchangeDuotone />
          <IonLabel>Trade</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab4" class="tabbar-item" href="/t/wallet">
          <IconWalletDuotone />
          <IonLabel>Wallet</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
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
    width: 2rem;
    height: 2rem;
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

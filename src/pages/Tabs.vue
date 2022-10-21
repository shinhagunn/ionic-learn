<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom" class="tabbar">
        <IonTabButton tab="tab1" class="tabbar-item" href="/home">
          <IconHomeDashDuotone />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab2" class="tabbar-item" href="/markets">
          <IconChartBarDuotone />
          <IonLabel>Markets</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab3" class="tabbar-item" href="/trade">
          <IconCoinConvertDuotone />
          <IonLabel>Trade</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab4" class="tabbar-item" href="/wallet">
          <IconWalletDuotone />
          <IonLabel>Wallet</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<style lang="less">
@keyframes rubberBand {
	0% {
		transform: scale3d(1, 1, 1);
	}

	30% {
		transform: scale3d(1.15, 0.85, 1);
	}

	40% {
		transform: scale3d(0.85, 1.15, 1);
	}

	50% {
		transform: scale3d(1.15, 0.95, 1);
	}

	65% {
		transform: scale3d(0.95, 1.05, 1);
	}

	75% {
		transform: scale3d(1.05, 0.95, 1)
	}

	100% {
		transform: scale3d(1, 1, 1);
	}
}

.tabbar {
	background-color: #20283c !important;
	border-top: none;

	&-item {
		color: @gray-color;
	}

	&::before,
	&::after {
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

		svg {
			animation: rubberBand 500ms alternate ease-out;
		}
	}

	svg {
		width: 2rem;
		height: 2rem;
	}

	.cls-1 {
		fill: @gray-color;
		transition: all 0.3s;
	}

	.cls-2 {
		fill: @placeholder-color;
		transition: all 0.3s;
	}
}
</style>

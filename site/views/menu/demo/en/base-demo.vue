<template>
  <bk-menu
    :opened-keys="['Number']"
    :active-key="'Tencent Microvision'"
  >
    <bk-menu-item :key="'QQ Music'">
      QQ Music
    </bk-menu-item>
    <bk-menu-item :key="'Tencent Video'">
      Tencent Video
    </bk-menu-item>
    <bk-menu-item :key="'WeChat'">
      WeChat
    </bk-menu-item>
    <bk-menu-item key="QQ">
      QQ
    </bk-menu-item>
    <bk-menu-group :key="'Photon'">
      <bk-menu-item :key="'Game for Peace'">
        Game for Peace
      </bk-menu-item>
      <bk-menu-item :key="'Dawn awakening'">
        Dawn awakening
      </bk-menu-item>
      <bk-menu-item :key="'Free fantasy'">
        Free fantasy
      </bk-menu-item>
      <bk-menu-item :key="'Fight the landlord with joy'">
        Fight the landlord with joy
      </bk-menu-item>
    </bk-menu-group>
    <bk-menu-group :name="'Tianmei'">
      <bk-menu-item :key="'Glory of Kings'">
        Glory of Kings
      </bk-menu-item>
      <bk-menu-item :key="'QQ Flying'">
        QQ Flying
      </bk-menu-item>
      <bk-menu-item :key="'Cool running every day'">
        Cool running every day
      </bk-menu-item>
      <bk-menu-item :key="'Return to the Empire'">
        Return to the Empire
      </bk-menu-item>
    </bk-menu-group>
    <bk-submenu
      :key="'Number'"
      :title="'Number'"
    >
      <bk-menu-item :key="'Tencent Microvision'">
        Tencent Microvision
      </bk-menu-item>
      <bk-menu-item :key="'Tencent Cloud'">
        Tencent Cloud
      </bk-menu-item>
      <bk-menu-item :key="'WeBank'">
        WeBank
      </bk-menu-item>
      <bk-menu-item key="Tencent Sports">
        Tencent Sports
      </bk-menu-item>
      <bk-menu-item key="Tencent Highlights">
        Tencent Highlights
      </bk-menu-item>
    </bk-submenu>
    <bk-submenu
      :key="'Content'"
      :title="'Content'"
    >
      <bk-menu-item :key="'Tencent Pictures'">
        Tencent Pictures
      </bk-menu-item>
      <bk-menu-item :key="'Tencent News'">
        Tencent News
      </bk-menu-item>
      <bk-menu-item :key="'Tencent Animation'">
        Tencent Animation
      </bk-menu-item>
      <bk-menu-item :key="'Reading Group'">
        Reading Group
      </bk-menu-item>
      <bk-menu-item :key="'Tencent E-sports'">
        Tencent E-sports
      </bk-menu-item>
    </bk-submenu>
  </bk-menu>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {

    },
  });
</script>

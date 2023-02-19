<template>
  <div class="navigation-demo">
    <bk-radio-group
      v-model="navigationType"
      class="navigation-demo-radio"
    >
      <bk-radio label="left-right">
        Left-right structure
      </bk-radio>
      <bk-radio label="top-bottom">
        Upper and lower structure
      </bk-radio>
    </bk-radio-group>
    <bk-navigation
      class="navigation-demo-content"
      :default-open="collapse"
      :navigation-type="navigationType"
      :side-title="'Monitoring platform'"
      @toggle="handleCollapse"
    >
      <template #menu>
        <bk-menu
          :collapse="collapse"
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
      <template #side-icon>
        <tree-application-shape />
      </template>
      <div class="content-demo">
        Fill in here
      </div>
      <template #header>
        <div
          class="header-demo"
        >
          Here is the head navigation
        </div>
      </template>
    </bk-navigation>
  </div>
</template>

<script>
  import { TreeApplicationShape } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {
      TreeApplicationShape,
    },
    setup() {
      const collapse = ref(false);
      const navigationType = ref('left-right');
      const handleCollapse = (v) => {
        collapse.value = !v;
      };

      return {
        collapse,
        navigationType,
        handleCollapse,
      };
    },
  });
</script>
<style lang="less">
.navigation-demo {
  &-radio {
    margin: 10px 0 20px 0;
  }

  &-content {
    border: 1px solid #ddd;

    .content-demo {
      font-size: 24px;
    }

    .header-demo {
      margin-right: auto;
      font-size: 20px;
    }
  }
}
</style>

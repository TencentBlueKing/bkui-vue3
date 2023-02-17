<template>
  <div class="navigation-demo">
    <bk-radio-group
      v-model="navigationType"
      class="navigation-demo-radio"
    >
      <bk-radio label="left-right">
        {{ t('左右结构') }}
      </bk-radio>
      <bk-radio label="top-bottom">
        {{ t('上下结构') }}
      </bk-radio>
    </bk-radio-group>
    <bk-navigation
      class="navigation-demo-content"
      :default-open="collapse"
      :navigation-type="navigationType"
      :side-title="t('监控平台')"
      @toggle="handleCollapse"
    >
      <template #menu>
        <bk-menu
          :collapse="collapse"
          :opened-keys="[t('数字')]"
          :active-key="t('腾讯微视')"
        >
          <bk-menu-item :key="t('QQ音乐')">
            {{ t("QQ音乐") }}
          </bk-menu-item>
          <bk-menu-item :key="t('腾讯视频')">
            {{ t("腾讯视频") }}
          </bk-menu-item>
          <bk-menu-item :key="t('微信')">
            {{ t("微信") }}
          </bk-menu-item>
          <bk-menu-item key="QQ">
            QQ
          </bk-menu-item>
          <bk-menu-group :name="t('光子')">
            <bk-menu-item :key="t('和平精英')">
              {{ t('和平精英') }}
            </bk-menu-item>
            <bk-menu-item :key="t('黎明觉醒')">
              {{ t('黎明觉醒') }}
            </bk-menu-item>
            <bk-menu-item :key="t('自由幻想')">
              {{ t('自由幻想') }}
            </bk-menu-item>
            <bk-menu-item :key="t('欢乐斗地主')">
              {{ t('欢乐斗地主') }}
            </bk-menu-item>
          </bk-menu-group>
          <bk-menu-group :name="t('天美')">
            <bk-menu-item :key="t('王者荣耀')">
              {{ t('王者荣耀') }}
            </bk-menu-item>
            <bk-menu-item :key="t('QQ飞车')">
              {{ t('QQ飞车') }}
            </bk-menu-item>
            <bk-menu-item :key="t('天天酷跑')">
              {{ t('天天酷跑') }}
            </bk-menu-item>
            <bk-menu-item :key="t('重返帝国')">
              {{ t('重返帝国') }}
            </bk-menu-item>
          </bk-menu-group>
          <bk-submenu
            :key="t('数字')"
            :title="t('数字')"
          >
            <bk-menu-item :key="t('腾讯微视')">
              {{ t('腾讯微视') }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯云')">
              {{ t('腾讯云') }}
            </bk-menu-item>
            <bk-menu-item :key="t('微众银行') ">
              {{ t('微众银行') }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯体育')">
              {{ t('腾讯体育') }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯看点')">
              {{ t("腾讯看点") }}
            </bk-menu-item>
          </bk-submenu>
          <bk-submenu
            :key="t('内容')"
            :title="t('内容')"
          >
            <bk-menu-item :key="t('腾讯影业')">
              {{ t("腾讯影业") }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯新闻')">
              {{ t("腾讯新闻") }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯动漫')">
              {{ t("腾讯动漫") }}
            </bk-menu-item>
            <bk-menu-item :key="t('阅文集团')">
              {{ t("阅文集团") }}
            </bk-menu-item>
            <bk-menu-item :key="t('腾讯电竞')">
              {{ t("腾讯电竞") }}
            </bk-menu-item>
          </bk-submenu>
        </bk-menu>
      </template>
      <template #side-icon>
        <tree-application-shape />
      </template>
      <div class="content-demo">
        {{ t('这里填写内容') }}
      </div>
      <template #header>
        <div
          class="header-demo"
        >
          {{ t('这里是头部导航') }}
        </div>
      </template>
    </bk-navigation>
  </div>
</template>

<script>
  import { TreeApplicationShape } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const collapse = ref(false);
      const navigationType = ref('left-right');
      const handleCollapse = (v) => {
        collapse.value = !v;
      };
      return {
        t,
        collapse,
        navigationType,
        handleCollapse,
        TreeApplicationShape,
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

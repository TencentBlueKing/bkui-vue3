<template>
  <bk-menu
    :opened-keys="[t('数字')]"
    :active-key="t('腾讯微视')"
  >
    <bk-menu-item :key="`${t('QQ音乐')}`">
      {{ t('QQ音乐') }}
    </bk-menu-item>
    <bk-menu-item :key="`${t('腾讯视频')}`">
      {{ t('腾讯视频') }}
    </bk-menu-item>
    <bk-menu-item :key="`${t('微信')}`">
      {{ t('微信') }}
    </bk-menu-item>
    <bk-menu-item key="QQ">
      QQ
    </bk-menu-item>
    <bk-menu-group :key="`${t('光子')}`">
      <bk-menu-item :key="`${t('和平精英')}`">
        {{ t('和平精英') }}
      </bk-menu-item>
      <bk-menu-item :key="`${t('黎明觉醒')}`">
        {{ t('黎明觉醒') }}
      </bk-menu-item>
      <bk-menu-item :key="`${t('自由幻想')}`">
        {{ t('自由幻想') }}
      </bk-menu-item>
      <bk-menu-item :key="`${t('欢乐斗地主')}`">
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
      <bk-menu-item :key="t('微众银行')">
        {{ t('微众银行') }}
      </bk-menu-item>
      <bk-menu-item key="腾讯体育">
        {{ t('腾讯体育') }}
      </bk-menu-item>
      <bk-menu-item key="腾讯看点">
        {{ t('腾讯看点') }}
      </bk-menu-item>
    </bk-submenu>
    <bk-submenu
      :key="t('内容')"
      :title="t('内容')"
    >
      <bk-menu-item :key="t('腾讯影业')">
        {{ t('腾讯影业') }}
      </bk-menu-item>
      <bk-menu-item :key="t('腾讯新闻')">
        {{ t('腾讯新闻') }}
      </bk-menu-item>
      <bk-menu-item :key="t('腾讯动漫')">
        {{ t('腾讯动漫') }}
      </bk-menu-item>
      <bk-menu-item :key="t('阅文集团')">
        {{ t('阅文集团') }}
      </bk-menu-item>
      <bk-menu-item :key="t('腾讯电竞')">
        {{ t('腾讯电竞') }}
      </bk-menu-item>
    </bk-submenu>
  </bk-menu>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

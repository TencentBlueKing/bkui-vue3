<template>
  <div class="navigation-demo">
    <bk-radio-group
      v-model="navigationType"
      class="navigation-demo-radio"
    >
      <bk-radio label="left-right">
        左右结构
      </bk-radio>
      <bk-radio label="top-bottom">
        上下结构
      </bk-radio>
    </bk-radio-group>
    <bk-navigation
      class="navigation-demo-content"
      :default-open="collapse"
      :navigation-type="navigationType"
      side-title="监控平台"
      :on-toggle="handleCollapse"
    >
      <template #menu>
        <bk-menu
          :collapse="collapse"
        >
          <bk-menu-item>QQ音乐</bk-menu-item>
          <bk-menu-item>腾讯视频</bk-menu-item>
          <bk-menu-item>微信</bk-menu-item>
          <bk-menu-item>QQ</bk-menu-item>
          <bk-menu-group name="光子">
            <bk-menu-item>和平精英</bk-menu-item>
            <bk-menu-item>黎明觉醒</bk-menu-item>
            <bk-menu-item>自由幻想</bk-menu-item>
            <bk-menu-item>欢乐斗地主</bk-menu-item>
          </bk-menu-group>
          <bk-menu-group name="天美">
            <bk-menu-item>王者荣耀</bk-menu-item>
            <bk-menu-item>QQ飞车</bk-menu-item>
            <bk-menu-item>天天酷跑</bk-menu-item>
            <bk-menu-item>重返帝国</bk-menu-item>
          </bk-menu-group>
          <bk-submenu title="数字">
            <bk-menu-item>腾讯微视</bk-menu-item>
            <bk-menu-item>腾讯云</bk-menu-item>
            <bk-menu-item>微众银行</bk-menu-item>
            <bk-menu-item>腾讯体育</bk-menu-item>
            <bk-menu-item>腾讯看点</bk-menu-item>
          </bk-submenu>
          <bk-submenu title="内容">
            <bk-menu-item>腾讯影业</bk-menu-item>
            <bk-menu-item>腾讯新闻</bk-menu-item>
            <bk-menu-item>腾讯动漫</bk-menu-item>
            <bk-menu-item>阅文集团</bk-menu-item>
            <bk-menu-item>腾讯电竞</bk-menu-item>
          </bk-submenu>
        </bk-menu>
      </template>
      <template #side-icon>
        <tree-application-shape />
      </template>
      <div class="content-demo">
        这里填写内容
      </div>
      <template #header>
        <div
          class="header-demo"
        >
          这里是头部导航
        </div>
      </template>
    </bk-navigation>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import { TreeApplicationShape } from '@bkui-vue/icon';
  const collapse = ref(false);
  const navigationType = ref('left-right');
  const handleCollapse = (v) => {
    collapse.value = !v;
  };
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

<template>
  <div class="navigation-demo">
    <bk-radio-group
      class="navigation-demo-radio"
      v-model="navigationType"
    >
      <bk-radio label="left-right"> 左右结构 </bk-radio>
      <bk-radio label="top-bottom"> 上下结构 </bk-radio>
    </bk-radio-group>
    <span v-bk-tooltips="{ content: 'test' }">test</span>
    <bk-navigation
      class="navigation-demo-content"
      :default-open="!collapse"
      :navigation-type="navigationType"
      side-title="监控平台"
      @toggle="handleCollapse"
    >
      <template #menu>
        <bk-menu
          :collapse="collapse"
          :opened-keys="['数字']"
          active-key="腾讯微视"
        >
          <bk-menu-item key="QQ音乐"> QQ音乐 </bk-menu-item>
          <bk-menu-item key="腾讯视频"> 腾讯视频 </bk-menu-item>
          <bk-menu-item key="微信"> 微信 </bk-menu-item>
          <bk-menu-item key="QQ"> QQ </bk-menu-item>
          <bk-menu-group
            fold-name="GX"
            name="光子"
          >
            <bk-menu-item key="和平精英"> 和平精英 </bk-menu-item>
            <bk-menu-item
              key="黎明觉醒"
              disabled
            >
              <span v-bk-tooltips="{ content: '暂未开放' }">黎明觉醒</span>
            </bk-menu-item>
            <bk-menu-item key="自由幻想"> 自由幻想 </bk-menu-item>
            <bk-menu-item key="欢乐斗地主"> 欢乐斗地主 </bk-menu-item>
          </bk-menu-group>
          <bk-menu-group
            fold-name="TiMi"
            name="天美世界"
          >
            <bk-menu-item key="王者荣耀"> 王者荣耀 </bk-menu-item>
            <bk-menu-item key="QQ飞车"> QQ飞车 </bk-menu-item>
            <bk-menu-item key="天天酷跑"> 天天酷跑 </bk-menu-item>
            <bk-menu-item key="重返帝国"> 重返帝国 </bk-menu-item>
          </bk-menu-group>
          <bk-submenu
            key="数字"
            title="数字"
          >
            <bk-menu-item key="腾讯微视"> 腾讯微视 </bk-menu-item>
            <bk-menu-item key="腾讯云"> 腾讯云 </bk-menu-item>
            <bk-menu-item key="微众银行"> 微众银行 </bk-menu-item>
            <bk-menu-item key="腾讯体育"> 腾讯体育 </bk-menu-item>
            <bk-menu-item key="腾讯看点"> 腾讯看点 </bk-menu-item>
          </bk-submenu>
          <bk-submenu
            key="内容"
            title="内容"
          >
            <bk-menu-item key="腾讯影业"> 腾讯影业 </bk-menu-item>
            <bk-menu-item key="腾讯新闻"> 腾讯新闻 </bk-menu-item>
            <bk-menu-item key="腾讯动漫"> 腾讯动漫 </bk-menu-item>
            <bk-menu-item key="阅文集团"> 阅文集团 </bk-menu-item>
            <bk-menu-item key="腾讯电竞"> 腾讯电竞 </bk-menu-item>
          </bk-submenu>
        </bk-menu>
      </template>
      <template #side-icon>
        <tree-application-shape />
      </template>
      <div class="content-demo">这里填写内容</div>
      <template #header>
        <div class="header-demo">这里是头部导航</div>
      </template>
    </bk-navigation>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import { bkTooltips } from '@bkui-vue/directives';
  import { TreeApplicationShape } from 'bkui-vue/lib/icon';

  // 注册 bkTooltips 指令
  const vBkTooltips = bkTooltips;
  const collapse = ref(true);
  const navigationType = ref('left-right');
  const handleCollapse = v => {
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

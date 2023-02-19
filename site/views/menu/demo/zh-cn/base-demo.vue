<template>
  <bk-menu
    :opened-keys="['数字']"
    :active-key="'腾讯微视'"
  >
    <bk-menu-item :key="'QQ音乐'">
      QQ音乐
    </bk-menu-item>
    <bk-menu-item :key="'腾讯视频'">
      腾讯视频
    </bk-menu-item>
    <bk-menu-item :key="'微信'">
      微信
    </bk-menu-item>
    <bk-menu-item key="QQ">
      QQ
    </bk-menu-item>
    <bk-menu-group :key="'光子'">
      <bk-menu-item :key="'和平精英'">
        和平精英
      </bk-menu-item>
      <bk-menu-item :key="'黎明觉醒'">
        黎明觉醒
      </bk-menu-item>
      <bk-menu-item :key="'自由幻想'">
        自由幻想
      </bk-menu-item>
      <bk-menu-item :key="'欢乐斗地主'">
        欢乐斗地主
      </bk-menu-item>
    </bk-menu-group>
    <bk-menu-group :name="'天美'">
      <bk-menu-item :key="'王者荣耀'">
        王者荣耀
      </bk-menu-item>
      <bk-menu-item :key="'QQ飞车'">
        QQ飞车
      </bk-menu-item>
      <bk-menu-item :key="'天天酷跑'">
        天天酷跑
      </bk-menu-item>
      <bk-menu-item :key="'重返帝国'">
        重返帝国
      </bk-menu-item>
    </bk-menu-group>
    <bk-submenu
      :key="'数字'"
      :title="'数字'"
    >
      <bk-menu-item :key="'腾讯微视'">
        腾讯微视
      </bk-menu-item>
      <bk-menu-item :key="'腾讯云'">
        腾讯云
      </bk-menu-item>
      <bk-menu-item :key="'微众银行'">
        微众银行
      </bk-menu-item>
      <bk-menu-item key="腾讯体育">
        腾讯体育
      </bk-menu-item>
      <bk-menu-item key="腾讯看点">
        腾讯看点
      </bk-menu-item>
    </bk-submenu>
    <bk-submenu
      :key="'内容'"
      :title="'内容'"
    >
      <bk-menu-item :key="'腾讯影业'">
        腾讯影业
      </bk-menu-item>
      <bk-menu-item :key="'腾讯新闻'">
        腾讯新闻
      </bk-menu-item>
      <bk-menu-item :key="'腾讯动漫'">
        腾讯动漫
      </bk-menu-item>
      <bk-menu-item :key="'阅文集团'">
        阅文集团
      </bk-menu-item>
      <bk-menu-item :key="'腾讯电竞'">
        腾讯电竞
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

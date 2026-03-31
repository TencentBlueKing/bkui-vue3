<template>
  <div class="login-userinfo-demo">
    <bk-navigation
      class="navigation-demo-content"
      :default-open="!collapse"
      navigation-type="top-bottom"
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
        </bk-menu>
      </template>
      <template #side-icon>
        <tree-application-shape />
      </template>
      <div class="content-demo">这里填写内容</div>
      <template #header>
        <div style="position: relative; z-index: 1000; margin-left: auto">
          <BkLoginUserinfo
            :offset="[10, 20]"
            :userinfo="userinfo"
          >
            <template #action>
              <ActionItem @click="handleClick('个人中心')">
                <template #icon>
                  <Qq />
                </template>
                个人中心
              </ActionItem>
              <ActionItem>
                <template #icon>
                  <Qq />
                </template>
                权限中心
              </ActionItem>
              <ActionItem
                href="/logout"
                target="_blank"
                theme="danger"
              >
                <template #icon>
                  <Qq />
                </template>
                退出登录
              </ActionItem>
            </template>
          </BkLoginUserinfo>
        </div>
      </template>
    </bk-navigation>
  </div>
</template>

<script setup>
  import BkLoginUserinfo, { ActionItem } from '@blueking/login-userinfo';
  import { TreeApplicationShape, Qq } from 'bkui-vue/lib/icon';
  import('@blueking/login-userinfo/vue3/vue3.css');

  const userinfo = {
    name: 'admin',
    email: 'admin@gmail.com',
    organization: '蓝鲸智云',
    timezone: 'Asia/Shanghai (UTC+08:00)',
  };
</script>
<style lang="less">
  .login-userinfo-demo {
    .bk-navigation-header {
      overflow: visible;
    }
  }
</style>

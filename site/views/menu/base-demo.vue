<template>
  <bk-menu>
    <bk-menu-item>
      测试ddd
      <template #icon>
        <search />
      </template>
    </bk-menu-item>
    <bk-menu-group name="计算资源">
      <bk-menu-item>asdfds</bk-menu-item>
      <bk-menu-item>asdff</bk-menu-item>
    </bk-menu-group>
    <bk-menu-item>asdfds</bk-menu-item>
    <bk-menu-item>asdfsdf</bk-menu-item>
    <bk-submenu>
      <bk-menu-item>asasd</bk-menu-item>
      <bk-menu-item>sdfsdddddf</bk-menu-item>
      <bk-menu-item>sdfsdfsdf</bk-menu-item>
      <bk-menu-item>sdfddfsdf</bk-menu-item>
    </bk-submenu>
    <bk-menu-item>asdfds</bk-menu-item>
    <bk-menu-item>asdfsdf</bk-menu-item>
    <bk-submenu>
      <bk-menu-item>sdfsddddf</bk-menu-item>
      <bk-menu-item>sdfsdddddf</bk-menu-item>
      <bk-menu-item>sdfsdfsdf</bk-menu-item>
      <bk-menu-item>sdfddfsdf</bk-menu-item>
    </bk-submenu>
  </bk-menu>
</template>

<script>
import { defineComponent } from 'vue';
import { Search } from '@bkui-vue/icon';
export default defineComponent({
  components: {
    Search,
  },
});
</script>

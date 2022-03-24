<template>
  <div style="width: 90%; margin: 0 auto; padding: 30px">
    <bk-badge style="margin-right: 40px">
      <bk-button theme="primary">
        top-right
      </bk-button>
      <template #icon>
        <Help />
      </template>
    </bk-badge>
    <bk-badge
      position="bottom-left"
      :count="999"
      theme="success"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        bottom-left
      </bk-button>
    </bk-badge>
    <bk-badge
      position="top-left"
      :count="999"
      theme="danger"
      :dot="true"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        top-left
      </bk-button>
    </bk-badge>
    <bk-badge
      position="bottom-right"
      :count="'数字'"
      :radius="'0px'"
      theme="warning"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        bottom-right
      </bk-button>
    </bk-badge>
    <span style="position: relative">
      未读消息
      <bk-badge
        :count="2"
        theme="danger"
        style="margin-left: 5px"
      />
    </span>
    <span style="position: relative">
      <bk-badge
        :dot="true"
        theme="danger"
        style="margin-left: 40px; margin-right: 5px"
      />
      未读消息
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Help } from '@bkui-vue/icon';
export default defineComponent({
  components: {
    Help,
  },
});
</script>

<template>
  <bk-button
    v-bk-ellipsis="'xxccxcxc'"
    @click="handlePopMsgBtn"
  >
    点击初始化Popover
  </bk-button>
  <bk-button @click="handleShowPop">
    show
  </bk-button>
  <bk-button
    @click="handleHidePop"
    @mousemove="handleMouseMove"
  >
    close
  </bk-button>
</template>
<script>
  import { defineComponent } from 'vue';

  import { bkEllipsis } from '@bkui-vue/directives';
  import { $bkPopover } from '@bkui-vue/popover';

  export default defineComponent({
    directives: {
      bkEllipsis,
    },
    data() {
      return {
        popInstance: null,
      };
    },
    methods: {
      handlePopMsgBtn(e) {
        this.popInstance = $bkPopover({
          target: e,
          content: 'create mode 100644 packages/icon/icons/left-turn-line.tsx',
        });
      },
      handleShowPop() {
        this.popInstance?.show();
      },
      handleHidePop() {
        this.popInstance?.close();
      },
      handleMouseMove(e) {
        this.popInstance?.update(e);
      },
    },
  });
</script>


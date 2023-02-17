<template>
  <bk-button
    v-bk-ellipsis="'xxccxcxc'"
    @click="handlePopMsgBtn"
  >
    {{ t("点击初始化Popover" ) }}
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
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { bkEllipsis } from '@bkui-vue/directives';
  import { $bkPopover } from '@bkui-vue/popover';

  export default defineComponent({
    directives: {
      bkEllipsis,
    },
    setup() {
      const popInstance = ref(null);
      const { t } = useI18n();

      const handlePopMsgBtn = (e) => {
        popInstance.value = $bkPopover({
          target: e,
          content: 'create mode 100644 packages/icon/icons/left-turn-line.tsx',
        });
      };

      const handleShowPop = () => {
        popInstance.value?.show();
      };

      const handleHidePop = () => {
        popInstance.value?.close();
      };

      const handleMouseMove = (e) => {
        popInstance.value?.update(e);
      };

      return {
        popInstance,
        handlePopMsgBtn,
        handleShowPop,
        handleHidePop,
        handleMouseMove,
        t,
      };
    },
  });
</script>


<template>
  <bk-button
    @click="handlePopMsgBtn"
  >
    点击初始化Popover
  </bk-button>
  <bk-button @click="handleShowPop">
    show
  </bk-button>
  <bk-button @click="handleShowPop">
    show 2
  </bk-button>
  <bk-button @click="handleHidePop">
    hide
  </bk-button>
  <div
    ref="refContentTable"
    style="width: 400px;"
  >
    <content-table />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';

  import { bkEllipsis } from '@bkui-vue/directives';
  import { $bkPopover } from '@bkui-vue/popover';

  import ContentTable from '../../table/column-template.vue';

  export default defineComponent({
    components: { ContentTable },
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
        this.popInstance?.close();
        this.popInstance = $bkPopover({
          target: e,
          content: this.$refs.refContentTable,
        });

        this.popInstance?.show();
      },
      handleShowPop(e) {
        this.popInstance?.update(e);
        this.popInstance?.show();
      },
      handleHidePop() {
        this.popInstance?.hide();
      },
      // handleMouseMove(e) {
      //   this.popInstance?.update(e);
      // },
    },
  });
</script>


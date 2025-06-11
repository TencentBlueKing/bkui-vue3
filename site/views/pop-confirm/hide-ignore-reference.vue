<template>
  <div>
    <bk-pop-confirm
      ref="popConfirmRef"
      width="288"
      :popover-options="{
        hideIgnoreReference: true,
      }"
      content="删除操作无法撤回，请谨慎操作！"
      title="确认删除该脚本？"
      trigger="click"
      @after-hidden="handleAfterHidden"
      @after-show="handleAfterShow"
      @confirm="ensure"
    >
      <bk-button>删除(点我不收起弹窗)</bk-button>
    </bk-pop-confirm>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {},
    setup() {
      const popConfirmRef = ref(null);
      function ensure() {
        console.error(popConfirmRef.value);
        console.log('ensure');
      }
      function handleAfterShow() {
        console.log('show');
      }
      function handleAfterHidden() {
        console.log('hide');
      }
      return {
        ensure,
        popConfirmRef,
        handleAfterShow,
        handleAfterHidden,
      };
    },
  });
</script>

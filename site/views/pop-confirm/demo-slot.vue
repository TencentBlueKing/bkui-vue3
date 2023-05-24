<template>
  <div>
    <bk-pop-confirm
      title="确认删除该脚本？"
      content="删除操作无法撤回，请谨慎操作！"
      width="288"
      @confirm="ensure"
    >
      <bk-button>删除</bk-button>
      <template #content>
        <div>测试将同时删除该结果数据下的所有样本曲线,</div>
      </template>
    </bk-pop-confirm>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {},
    setup() {
      function ensure() {
        console.log('ensure');
      }
      return {
        ensure,
      };
    },
  });
</script>

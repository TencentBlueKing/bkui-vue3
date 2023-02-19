<template>
  <div>
    <bk-timeline
      :list="state.list"
    />
  </div>
</template>
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          {
            tag: '一天前',
            content: '由pony上线到蓝鲸市场',
          },
          {
            tag: '步骤1',
            content: '<div style="color: red;">由<strong>tony</strong>部署到生产环境并发布至应用市场</div>',
          },
          {
            tag: '步骤2',
            content: '<div>由<strong>allen</strong>上线到<span style="color: #3c96ff;">蓝鲸市场</span></div>',
          },
          {
            tag: '步骤3',
            content: '由<strong>tony</strong>部署到<p style="color: #ff5656">生产环境</p>并发布至<strong>应用市场</strong>',
          },
          {
            tag: '步骤4',
            content: '由<strong>allen</strong>部署到预发布环境',
          },
        ],
      });

      return {
        state,
      };
    },
  });

</script>

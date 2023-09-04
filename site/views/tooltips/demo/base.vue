<template>
  <div>
    <span
      ref="nodeRef"
      v-bk-tooltips="{ content: '提示信息' }"
      class="bk-tooltips-base"
    >
      <info />
    </span>
   &nbsp;&nbsp;&nbsp;&nbsp;
    <span
      ref="nodeRef"
      v-bk-tooltips="{ content: '提示信息2,延迟3s', delay: 3000 }"
      class="bk-tooltips-base"
    >
      <info />
    </span>
  </div>
</template>

<script>
  import { bkTooltips } from 'bkui-vue';
  import { Info } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      Info,
    },
    directives: {
      bkTooltips,
    },
  });
</script>

<style lang="postcss">
.bk-tooltips-base {
  font-size: 18px;
  color: #3a84ff;
}
</style>

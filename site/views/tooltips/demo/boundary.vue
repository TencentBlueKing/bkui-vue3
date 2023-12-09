<template>
  <div ref="box">
    <div style="border: 1px solid #ccc;height: 50px;">
      <div
        v-bk-tooltips="{ content: '提示信息',boundary:'parent' }"
        class="bk-tooltips-base"
      >
        <info />
      </div>
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <div
      v-bk-tooltips="{ content: '提示信息2,延迟3s', boundary:box }"
      class="bk-tooltips-base"
    >
      <info />
    </div>
  </div>
</template>

<script>
  import { bkTooltips } from 'bkui-vue';
  import { Info } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {
      Info,
    },
    directives: {
      bkTooltips,
    },
    setup() {
      const box = ref(null);
      const demo = ref(null);
      return {
        box,
        demo,
      };
    },
  });
</script>

<style lang="postcss">
.bk-tooltips-base {
  font-size: 18px;
  color: #3a84ff;
}
</style>

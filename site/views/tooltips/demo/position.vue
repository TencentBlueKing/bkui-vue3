<template>
  <div class="bk-tooltips-position-top">
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'top-start'}"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'top'}"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'top-end'}"
      class="info"
    >
      <info />
    </span>
  </div>

  <div class="bk-tooltips-position-center">
    <div class="bk-tooltips-position-center-left">
      <span
        v-bk-tooltips="{content: '提示信息', placement: 'left'}"
        class="info"
      >
        <info />
      </span>
    </div>

    <div class="bk-tooltips-position-center-right">
      <span
        v-bk-tooltips="{content: '提示信息', placement: 'right'}"
        class="info"
      >
        <info />
      </span>
    </div>
  </div>

  <div class="bk-tooltips-position-bottom">
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'bottom-start'}"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'bottom'}"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{content: '提示信息', placement: 'bottom-end'}"
      class="info"
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
    setup() {
      const config = {
        content: '提示信息',
      };
      return {
        config,
      };
    },
  });
</script>

<style lang="postcss">
  .info {
    font-size: 18px;
    color: #3a84ff;
  }

  .mr20 {
    margin-right: 20px;
  }

  .bk-tooltips-position-center {
    margin: 10px auto;
  }

  .bk-tooltips-position-center-left {
    display: inline-block;
  }

  .bk-tooltips-position-center-right {
    display: inline-block;
    margin-left: 58px;
  }
</style>

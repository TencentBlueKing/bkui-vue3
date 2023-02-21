<template>
  <div class="bk-tooltips-position-top">
    <span
      v-bk-tooltips="{ content: tips, placement: 'top-start' }"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{ content: tips, placement: 'top' }"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{ content: tips, placement: 'top-end' }"
      class="info"
    >
      <info />
    </span>
  </div>

  <div class="bk-tooltips-position-center">
    <div class="bk-tooltips-position-center-left">
      <span
        v-bk-tooltips="{ content: tips, placement: 'left' }"
        class="info"
      >
        <info />
      </span>
    </div>

    <div class="bk-tooltips-position-center-right">
      <span
        v-bk-tooltips="{ content: tips, placement: 'right' }"
        class="info"
      >
        <info />
      </span>
    </div>
  </div>

  <div class="bk-tooltips-position-bottom">
    <span
      v-bk-tooltips="{ content: tips, placement: 'bottom-start' }"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{ content: tips, placement: 'bottom' }"
      class="info mr20"
    >
      <info />
    </span>
    <span
      v-bk-tooltips="{ content: tips, placement: 'bottom-end' }"
      class="info"
    >
      <info />
    </span>
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
      const tips = ref('Prompt information');
      const config = {
        content: tips,
      };

      return {
        tips,
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

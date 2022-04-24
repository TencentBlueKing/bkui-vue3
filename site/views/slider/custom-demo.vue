<template>
  <div class="demo">
    <div :style="{ margin: '0 10px 30px 10px' }">
      <bk-slider
        v-model="demo1"
        :custom-content="customContent"
        show-tip
        :step="20"
      />
    </div>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  import BkSlider from '@bkui-vue/slider';

  export default defineComponent({
    name: 'SiteBkSlider',
    components: {
      BkSlider,
    },
    setup() {
      const demo1 = ref(20);
      const customContent = {
        0: {
          label: '糟糕',
        },
        20: {
          label: '一般',
        },
        40: {
          label: '还行',
          tip: '还行勉勉强强',
        },
        60: {
          label: '满意',
        },
        80: {
          label: '很好',
        },
        100: {
          label: '非常满意',
        },
      };
      return {
        demo1,
        customContent,
      };
    },
  });

</script>
<style scoped>
  .demo {
    width: 100%;
  }
</style>

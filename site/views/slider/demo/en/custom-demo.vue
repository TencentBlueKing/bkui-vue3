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
          label: 'Terrible',
        },
        20: {
          label: 'Commonly',
        },
        40: {
          label: ' Okay',
          tip: 'I\'m still struggling',
        },
        60: {
          label: 'Satisfied',
        },
        80: {
          label: 'Very good',
        },
        100: {
          label: 'Very satisfied',
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

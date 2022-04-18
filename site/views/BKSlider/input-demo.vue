<template>
  <div class="demo">
    <div>
      <bk-slider
        v-model="demo1"
        show-input
      />
    </div>
    <div :style="{ marginTop: '30px' }">
      <bk-slider
        v-model="demo2"
        range
        show-input
        :min-value="-100"
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
    const demo2 = ref([5, 20]);
    const demo3 = ref(10);
    return {
      demo1,
      demo2,
      demo3,
    };
  },
});

</script>
<style scoped>
  .demo {
    width: 100%;
  }
</style>

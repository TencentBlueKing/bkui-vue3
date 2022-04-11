<template>
  <div class="demo">
    <div>
      <bk-slider
        v-model="demo1"
        :step="5"
      />
    </div>
    <div :style="{ marginTop: '30px' }">
      <bk-slider
        v-model="demo2"
        :step="5"
        show-interval
        range
      />
    </div>
    <div :style="{ marginTop: '30px' }">
      <bk-slider
        v-model="demo1"
        :step="5"
        show-interval
        show-interval-label
      />
    </div>
    <div :style="{ marginTop: '50px' }">
      <bk-slider
        v-model="demo1"
        :step="5"
        show-interval
        show-interval-label
        :formatter-label="(v) => `${v}%`"
      />
    </div>
    <div :style="{ marginTop: '50px' }">
      <bk-slider
        v-model="demo1"
        :step="5"
        show-interval
        show-button-label
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

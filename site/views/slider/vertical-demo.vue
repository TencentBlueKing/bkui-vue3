<template>
  <div class="demo">
    <div>
      <bk-slider
        v-model="demo1"
        vertical
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
      return {
        demo1,
      };
    },
  });

</script>
<style scoped>
  .demo {
    width: 100%;
  }
</style>

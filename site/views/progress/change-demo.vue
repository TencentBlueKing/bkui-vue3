<template>
  <div style="width: 100%">
    <div class="mb10">
      <bk-progress :percent="percent" />
    </div>
    <bk-button
      type="primary"
      @click="changeRadius"
    >
      改变值
    </bk-button>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';

import BkProgress from '@bkui-vue/progress';

import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'SiteProgress',
  components: {
    BkProgress,
    BkButton,
  },
  setup() {
    const percent = ref(0);
    const changeRadius = () => {
      percent.value = Number(Math.random() * 100);
    };
    return {
      percent,
      changeRadius,
    };
  },
});
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>

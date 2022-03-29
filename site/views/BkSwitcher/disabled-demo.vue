<template>
  <div>
      <div class="mb20 block">
        <span class="mr20 f14">选中时禁用</span>
        <bk-switcher v-model="value1" :disabled="true"></bk-switcher>
        <bk-switcher v-model="value1" theme="primary" :disabled="true"></bk-switcher>
    </div>
    <div class="mb20 block">
        <span class="mr20 f14">未选中时禁用</span>
        <bk-switcher v-model="value2" :disabled="true"></bk-switcher>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';

import BkSwitcher from '@bkui-vue/switcher';

export default defineComponent({
  name: 'SiteBkSwitcher',
  components: {
    BkSwitcher,
  },
  setup() {
    const value1 = ref(true)
    const value2 = ref(false)
    return {
      value1,
      value2
    };
  },
});

</script>


<style scoped>
  .bk-switcher {
    margin-right: 10px;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .mr20 {
    margin-right: 20px;
    display: inline-block;
  }
  .f14 {
    font-size: 14px;
  }
  .block {
    display: block;
    width: 100%;
  }
</style>
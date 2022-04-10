<template>
  <div>
    <bk-switcher
      v-model="demo1"
      size="large"
    />
    <bk-switcher v-model="demo1" />
    <bk-switcher
      v-model="demo1"
      size="small"
    />
    <!-- 配置 show-text 时 size 失效 -->
    <bk-switcher
      v-model="demo1"
      size="small"
      show-text
    />
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
    const demo1 = ref(true);
    return {
      demo1,
    };
  },
});

</script>


<style scoped>
  .bk-switcher {
    margin-right: 10px;
  }
</style>

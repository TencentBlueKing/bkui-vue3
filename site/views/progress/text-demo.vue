<template>
  <div style="width: 100%">
    <div class="mb10">
      <bk-progress
        :text-inside="true"
        :show-text="false"
        :stroke-width="18"
        :percent="46"
      />
    </div>
    <div class="mb10">
      <bk-progress
        :text-inside="true"
        :stroke-width="18"
        :percent="46"
      />
    </div>
    <div>
      <bk-progress
        :text-inside="true"
        :stroke-width="22"
        :percent="70"
        :format="format"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

import BkProgress from '@bkui-vue/progress';

export default defineComponent({
  name: 'SiteProgress',
  components: {
    BkProgress,
  },
  setup() {
    const format = value => `自定义过滤文案：${value}`;
    return {
      format,
    };
  },
});
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>

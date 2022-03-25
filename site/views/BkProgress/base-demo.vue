<template>
  <div style="width: 100%">
    <div class="mb10">
      <bk-progress :percent="0" />
    </div>
    <div class="mb10">
      <bk-progress :percent="28" />
    </div>
    <div class="mb10">
      <bk-progress
        :theme="'warning'"
        :percent="46"
      />
    </div>
    <div class="mb10">
      <bk-progress
        :theme="'danger'"
        :percent="73"
      />
    </div>
    <div class="mb10">
      <bk-progress
        :theme="'success'"
        :percent="90"
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

  },
});
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>

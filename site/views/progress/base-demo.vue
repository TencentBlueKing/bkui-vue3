<template>
  <div style="width: 100%">
    <div class="mb10">
      <bk-progress
        :percent="0"
        size="small"
      />
    </div>
    <div class="mb10">
      <bk-progress :percent="28"/>
    </div>
    <div class="mb10">
      <bk-progress
        :percent="46"
        :theme="'warning'"
        size="large"
      />
    </div>
    <div class="mb10">
      <bk-progress
        :percent="73"
        :theme="'danger'"
        size="huge"
      />
    </div>
    <div class="mb10">
      <bk-progress
        :percent="90"
        :theme="'success'"
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
    setup() {},
  });
</script>

<style scoped>
  .mb10 {
    margin-bottom: 10px;
  }
</style>

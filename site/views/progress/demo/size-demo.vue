<template>
  <div style="width: 100%">
    <div>
      <div class="mb10">
        <bk-progress
          :size="'small'"
          :percent="0"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'small'"
          :percent="28"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'small'"
          :theme="'warning'"
          :percent="46"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'small'"
          :theme="'danger'"
          :percent="73"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'small'"
          :theme="'success'"
          :percent="90"
        />
      </div>
    </div>
    <div>
      <div class="mb10">
        <bk-progress
          :size="'large'"
          :percent="0"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'large'"
          :percent="28"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'large'"
          :theme="'warning'"
          :percent="46"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'large'"
          :theme="'danger'"
          :percent="73"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :size="'large'"
          :theme="'success'"
          :percent="90"
        />
      </div>
      <div class="mb10">
        <bk-progress
          :theme="'success'"
          :stroke-width="20"
          :percent="90"
        />
      </div>
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

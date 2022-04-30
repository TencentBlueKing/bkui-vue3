<template>
  <div style="width: 100%">
    <div style="margin-bottom: 20px;">
      <bk-progress
        :text-inside="false"
        bg-color="#3a84ff"
        type="circle"
        :percent="30"
      />
      <bk-progress
        :text-inside="false"
        type="dashboard"
        :percent="0"
        color="#f56c6c"
      >
        <span>未开始</span>
      </bk-progress>
    </div>
    <div style="margin-bottom: 20px;">
      <bk-progress
        text-inside
        type="circle"
        :width="150"
        :stroke-width="10"
        :percent="10"
        color="#f56c6c"
      />
      <bk-progress
        text-inside
        type="circle"
        :width="100"
        :percent="10"
        color="#ff9c01"
      />
      <bk-progress
        text-inside
        type="circle"
        :width="50"
        :percent="10"
        color="#f56c1c"
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

.bk-progress {
  margin-right: 30px;
}
</style>

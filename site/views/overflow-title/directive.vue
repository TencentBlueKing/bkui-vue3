<template>
  <div>
    <div style="width: 100px; margin-bottom: 20px">
      <div class="text-ov" v-overflow-title>
        222222222222222222222222
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

import { overflowTitle } from 'bkui-vue';

export default defineComponent({
  directives: {
    overflowTitle,
  },
  setup() { },
});
</script>

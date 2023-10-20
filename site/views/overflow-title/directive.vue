<template>
  <div>
    <div style="width: 100px;margin-bottom: 20px;">
      <div
        v-overflow-title
        class="text-ov"
      >
        222222222222222222222222
      </div>
    </div>
  </div>
</template>
<script>

  import { overflowTitle } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    directives: {
      overflowTitle,
    },
    setup() {
    },
  });

</script>

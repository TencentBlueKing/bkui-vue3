<template>
  <div>
    <bk-loading
      loading
      :title="loadingText"
    >
      <div class="loading-title-container">
        Content
      </div>
    </bk-loading>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';


  export default defineComponent({
    setup() {
      const loadingText = ref('Data loading');

      return {
        loadingText,
      };
    },
  });
</script>

<style lang="postcss">
.loading-title-container {
  display: flex;
  width: 100%;
  height: 360px;
  align-items: center;
  justify-content: center;
}
</style>

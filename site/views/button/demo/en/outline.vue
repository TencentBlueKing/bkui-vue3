<template>
  <div class="basic-button-list">
    <bk-button outline>
      Inverted Button
    </bk-button>
    <bk-button
      outline
      theme="primary"
      class="ml10"
    >
      Inverted Button
    </bk-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Outline',
  });
</script>

<style lang="postcss">
.ml10 {
  margin-left: 10px;
}
</style>

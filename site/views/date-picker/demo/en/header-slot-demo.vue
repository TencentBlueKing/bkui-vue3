<template>
  <bk-date-picker
    v-model="dateValue"
    :header-slot-cls="'custom-header-wrapper'"
  >
    <template #header>
      <div class="custom-header">
        I am a custom header
      </div>
    </template>
  </bk-date-picker>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dateValue = ref(''); // new Date();
      return {
        dateValue,
      };
    },
  });
</script>

<style lang="postcss">
.custom-header-wrapper {
  color: green;
}

.custom-header {
  text-align: center;
}
</style>

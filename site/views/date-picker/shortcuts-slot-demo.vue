<template>
  <bk-date-picker v-model="dateValue">
    <template #shortcuts>
      <div class="custom-shortcuts">
        自定义插槽
      </div>
    </template>
  </bk-date-picker>
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref(new Date());
</script>
<style lang="postcss">
.custom-shortcuts {
  color: red;
  text-align: center;
}
</style>

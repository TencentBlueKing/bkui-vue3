<template>
  <div>
    <bk-radio-group v-model="radioGroupValue">
      <bk-radio label="left" />
      <bk-radio label="right" />
      <bk-radio label="top" />
      <bk-radio label="bottom" />
    </bk-radio-group>
    <bk-resize-layout
      style="height: 500px;"
      :placement="radioGroupValue"
      :initial-divide="'40%'"
    >
      <template #aside>
        <div>aside</div>
      </template>
      <template #main>
        <div>main</div>
      </template>
    </bk-resize-layout>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkResizeLayout from '@bkui-vue/resize-layout';
  const radioGroupValue = ref('left');
</script>

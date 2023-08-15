<template>
  <div>
    <bk-color-picker
      v-model="color1"
      :show-value="false"
    >
      <template #trigger="{value,isShow}">
        <div>
         <div>value:<span>{{value}}</span></div>
         <div>isShow:<span>{{String(isShow)}}</span></div>
        </div>
      </template>
    </bk-color-picker>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkColorPicker from '@bkui-vue/color-picker';
  const color1 = ref('');
  const change = (v) => {
    console.log(v);
  };
</script>

<style lang="postcss" scoped>
.color-picker {
  margin-right: 20px;
}
</style>

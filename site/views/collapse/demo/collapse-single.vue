<template>
  <bk-collapse-panel
    v-model="active"
  >
    <span>collapse-panel:方案成熟</span>
    <template #content>
      <div>
        拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维
      </div>
    </template>
  </bk-collapse-panel>
</template>
<script setup>
  import { ref } from 'vue';

  const active =  ref(true);
</script>


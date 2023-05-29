<template>
  <bk-collapse
    class="bk-collapse-demo"
    v-model="activeIndex">
    <bk-collapse-panel :name="1">
      <span>方案成熟</span>
      <template #content>
        <div>
          拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维
        </div>
      </template>
    </bk-collapse-panel>
    <bk-collapse-panel>
      <template #header>
        <div style="display: flex;justify-content: space-between;align-items: center">
          <div>覆盖全面</div>
          <div>{{ activeIndex.includes(2)?'展开':'收起' }}</div>
        </div>
      </template>
      <template #content>
        <div>
          拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维
        </div>
      </template>
    </bk-collapse-panel>
  </bk-collapse>
</template>
<script setup>
  import { ref } from 'vue';
  const activeIndex =  ref([0]);
</script>
<style scoped>
  .bk-collapse-demo {
    box-shadow: 0 0 8px 0px #ccc;
  }
</style>

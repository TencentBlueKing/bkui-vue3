<template>
  <div style="height: 300px;">
    <bk-table :columns="columns" :data="tableData" :max-height="maxHeight" @scroll-bottom="handleScrollBottom" />
  </div>
</template>

<script setup type="jsx">
import { defineComponent, ref, computed, reactive } from 'vue';
import { DATA_FIX_COLUMNS, DATA_FIX_TABLE } from './options';
const t = (str) => str;

const tableData = reactive(DATA_FIX_TABLE);

const columns = computed(() => DATA_FIX_COLUMNS);

const maxHeight = ref(300);

const handleDblClick = (...args) => {
  console.log(args);
}
const handleScrollBottom = (args) => {
  console.log('handleScrollBottom', args);
}
</script>

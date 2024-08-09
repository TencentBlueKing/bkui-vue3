<template>
  <div style="width: 100%; height: 500px" v-if="isShow">
    <bk-table ref="refTable" height="100%" :columns="columns" :data="tableData" :pagination="pagination"
      empty-cell-text="--" :pagination-heihgt="60" show-overflow-tooltip shift-multi-checked
      @selection-change="handleSelectionChange" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import { DATA_FIX_COLUMNS } from './options';
const appendColumns = new Array(20).fill('').map((item, index) => ({ label: `新增列${index}`, field: `new-${index}`, width: 50 }));

const tableData = reactive(new Array(Math.ceil(Math.random() * 100) + 500).fill('').map((_, index) => ({
  ip: `${index}--192.168.0.x`,
  source: index,
  create_by: `user-admin-${index}`,
  status: '',
  create_time: `2018-05-25 15:02:24.${index}`,
  ...appendColumns.reduce((acc, cur, curIndex) => ({ ...acc, [`new-${curIndex}`]: `随机数据-${curIndex}-${index}` }), {})
})));

const isShow = ref(true);
const renderTable = () => { isShow.value = !isShow.value; }
const pagination = ref({ count: tableData.length, limit: 20 });
const columns = reactive(DATA_FIX_COLUMNS.concat(appendColumns));
const refTable = ref(null);
const handleSelectionChange = args => {
};
</script>

<template>
  <Ediatable>
    <template #default>
      <HeadColumn
        :min-width="120"
        :width="450"
        memo="目标集群的提示"
      >
        <template #append>
          <span style='color: red;margin-left:5px;font-size:10px'>必填</span>,
        </template>
        <span>目标集群</span>
      </HeadColumn>
      <HeadColumn
        :required="false"
        :min-width="110"
        :width="150"
      >
        <span>扩容节点类型</span>
      </HeadColumn>
      <HeadColumn
        :min-width="100"
        :width="300"
      >
        <span>扩容至(台)</span>
      </HeadColumn>
      <HeadColumn
        :min-width="100"
        :width="300"
      >
        <span>包含Key</span>
      </HeadColumn>
      <HeadColumn
        :min-width="100"
        :width="300"
      >
        <span>指定时间</span>
      </HeadColumn>
      <HeadColumn
        :required="false"
        :min-width="150"
        :width="300"
      >
        <span>切换模式</span>
      </HeadColumn>
      <HeadColumn
        fixed="right"
        :required="false"
        :width="120"
      >
        操作
      </HeadColumn>
    </template>
    <template #data>
      <RenderRow
        v-for="(item, index) in tableData"
        :key="item.rowKey"
        ref="rowRefs"
        :data="item"
        :removeable="tableData.length < 2"
        @add="payload => handleAppend(index, payload)"
        @remove="handleRemove(index)"
        @cluster-input-finish="value => handleClusterInputFinish(index, value)"
      />
    </template>
  </Ediatable>
  <Button
    style="width: 88px; margin-top: 16px"
    theme="primary"
    @click="handleSubmit"
  >
    提交
  </Button>
</template>
<script setup lang="tsx">
  import { ref } from 'vue';
  import Ediatable, { HeadColumn } from '@blueking/ediatable';
  import RenderRow, { createRowData, type IDataRow } from './components/render-row.vue';
  import { Button } from 'bkui-vue';

  import '@blueking/ediatable/vue3/vue3.css';

  const rowRefs = ref();
  const tableData = ref([createRowData()]);

  const handleClusterInputFinish = (index: number, value: string) => {
    tableData.value[index].cluster = value;
    tableData.value[index].nodeType = 'Proxy';
  };

  // 追加一个集群
  const handleAppend = (index: number, appendList: Array<IDataRow>) => {
    tableData.value.splice(index + 1, 0, ...appendList);
  };

  // 删除一个集群
  const handleRemove = (index: number) => {
    tableData.value.splice(index, 1);
  };

  const handleSubmit = async () => {
    const params = await Promise.all(rowRefs.value.map((item: { getValue: () => any }) => item.getValue()));
    console.log('params>>>', params);
  };
</script>


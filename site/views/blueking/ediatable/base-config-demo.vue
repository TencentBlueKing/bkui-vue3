<template>
  <Ediatable :thead-list="theadList">
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
  import Ediatable, { type IHead } from '@blueking/ediatable';
  import RenderRow, { createRowData, type IDataRow } from './components/render-row.vue';
  import { Button } from 'bkui-vue';

  import '@blueking/ediatable/vue3/vue3.css';

  const rowRefs = ref();
  const tableData = ref([createRowData()]);

  const theadList: IHead[] = [
    {
      minWidth: 120,
      title: '目标集群',
      width: 450,
      renderAppend: () => <span style='color: red;margin-left:5px;font-size:10px'>必填</span>,
      memo: '目标集群的提示',
    },
    {
      minWidth: 110,
      required: false,
      title: '扩容节点类型',
      width: 150,
    },
    {
      minWidth: 100,
      title: '扩容至(台)',
      width: 300,
    },
    {
      minWidth: 100,
      title: '包含Key',
      width: 300,
    },
    {
      minWidth: 100,
      title: '指定时间',
      width: 300,
    },
    {
      minWidth: 150,
      required: false,
      title: '切换模式',
      width: 300,
    },
    {
      fixed: 'right',
      required: false,
      title: '操作',
      width: 120,
    },
  ];

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

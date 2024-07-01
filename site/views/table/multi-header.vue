<template>
  <h2>bk-table-column 模板模式：</h2>
  <bk-table :data="projectTable" :height="500" :pagination="pagination">
    <bk-table-column type="index" label='序号' width="80"></bk-table-column>
    <bk-table-column label="用户组" prop="groupName">
      <bk-table-column label="用户描述" prop="groupDesc" />
      <bk-table-column label="有效期" prop="validityPeriod" />
    </bk-table-column>

    <bk-table-column label="加入时间" prop="joinedTime" />
  </bk-table>
  <h2>props.columns 绑定模式：</h2>
  <bk-table :data="projectTable" :columns="columns" :height="500" :pagination="pagination">
  </bk-table>
</template>

<script setup>
import { ref, reactive } from 'vue';
const pagination = ref({ count: 11, limit: 10, current: 1 });
const columns = reactive([
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '用户组',
    children: [
      {
        label: '操作员1',
        field: 'operator',
      },
      {
        label: '操作员2',
        field: 'operator',
      },
    ],
  },
  {
    label: '用户描述',
    field: 'groupDesc',
  },
  {
    label: '有效期',
    field: 'validityPeriod',
  },
  {
    label: '加入时间',
    field: 'joinedTime',
  },
]);

const projectTable = ref([
  {
    groupId: 1,
    groupName: '11',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: true,
  },
  {
    groupId: 2,
    groupName: '22',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 3,
    groupName: '33',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 4,
    groupName: '44',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 5,
    groupName: '55',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 6,
    groupName: '66',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 7,
    groupName: '77',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 8,
    groupName: '88',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 9,
    groupName: '99',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 10,
    groupName: '1010',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 11,
    groupName: '1111',
    groupDesc: 'kjkjkjk',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
]);
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
}

.cell {
  flex: 1;
  margin: 0 5px 0 5px;
}
</style>

<!-- <template>
  <bk-button @click="clearSelection">取消全选</bk-button>
  <div style="display: grid;">
    <div style="height: 300px">
      <bk-table rowDraggable ref="refTable" :data="projectTable" height="auto" max-height="100%" stripe
        :fixedBottom="fixedBottom" show-overflow-tooltip :pagination="pagination">
        <bk-table-column type="selection" :min-width="30" width="30" align="center" />
        <bk-table-column label="用户组" prop="groupName" :sort="true" />
        <bk-table-column label="用户描述" prop="groupDesc" />
        <bk-table-column label="有效期" prop="validityPeriod" />
        <bk-table-column label="加入时间" prop="joinedTime" />
        <bk-table-column label="加入方式/操作人" prop="operateSource">
          <template #default="{ row }">
            {{ row.operateSource }}/{{ row.operator }}
          </template>
        </bk-table-column>
      </bk-table>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive } from 'vue'
const refTable = ref(null);
const pagination = ref({ count: 11, limit: 10, current: 1 });
const clearSelection = () => {
  refTable.value.clearSelection();
};
const fixedBottom = reactive({
  position: 'relative',
  height: 42
})
const projectTable = ref([{
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
}, {
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
}, {
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
}, {
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
}, {
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
}]);
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
</style> -->

<script setup>
import {
  ref,
  // h,
} from 'vue';
const tableData = ref([]);
// const renderedTableRows = ref(null);

const columns = [
  {
    label: '名称/内网IP',
    type: 'selection',
  },
  {
    label: '序号',
    type: 'index',
    sort: {
      value: 'asc',
    },
    width: 50,
    minWidth: 80,
  },
  {
    label: '名称/内网IP',
    field: 'ip',
  },
  {
    label: '来源',
    field: 'source',
    width: 80,
    filter: {
      list: [
        {
          text: 'QQ',
          value: 'QQ',
        },
        {
          text: '微信',
          value: '微信',
        },
        {
          text: 'Email',
          value: 'Email',
        },
      ],
    },
  },
  {
    label: '创建时间',
    field: 'create_time',
    sort: 'custom',
    width: 200,
  },
  {
    label: '状态',
    field: 'status',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)登录服务ID，分区服场景使用，合服后上报合服后服务器ID',
    field: 'GameSvrId',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)游戏事件的时间, 格式 YYYY-MM-DD HH:MM:SS',
    field: 'dtEventTime',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)ios 0/android 1',
    field: 'PlatID',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)注册服ID，分区服场景使用。其他场景时填写0',
    field: 'iZoneAreaID',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)用户OPENID号',
    field: 'vOpenID',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)玩家角色ID',
    field: 'vRoleID',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)等级',
    field: 'iLevel',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)玩家角色名',
    field: 'vRoleName',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)VIP等级',
    field: 'iVipLevel',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)用于关联一次购买产生多条不同类型的货币日志',
    field: 'Sequence',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)玩家角色战力Combat Effectiveness',
    field: 'iRoleCE',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)道具类型',
    field: 'iGoodsType',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)道具ID',
    field: 'iGoodsId',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)数量',
    field: 'iCount',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)动作后的物品存量',
    field: 'AfterCount',
    sort: true,
    width: 200,
  },
  {
    label: '(必填))道具流动一级原因',
    field: 'Reason',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)道具流动二级原因',
    field: 'SubReason',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)花费代币或金币购买道具情况下输出消耗的钱数量，否则填0',
    field: 'iMoney',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)钱的类型MONEYTYPE,其它货币类型参考FAQ文档',
    field: 'iMoneyType',
    sort: true,
    width: 200,
  },
  {
    label: '(必填)(必填)增加 0/减少',
    field: 'AddOrReduce',
    sort: true,
    width: 200,
  },
];
const DATASIZE = 100;
// 生成一万条数据
const generateData = () => {
  const data = [];
  for (let i = 0; i < DATASIZE; i++) {
    data.push({
      ip: `192.168.0.${i + 1}`,
      source: ['QQ', '微信', 'Email'][Math.floor(Math.random() * 3)],
      status: ['创建中', '正常'][Math.floor(Math.random() * 2)],
      create_time: new Date().toLocaleString(),
      selected: false,
      AddOrReduce: '1',
      AfterCount: '6',
      GameSvrId: '0',
      PlatID: '1',
      Reason: '50',
      Sequence: '0',
      SubReason: '0',
      dtEventTime: '2024-07-01 23:59:07',
      iCount: '-5',
      iGoodsId: '2400006',
      iGoodsType: '24',
      iLevel: '62',
      iMoney: '0',
      iMoneyType: '0',
      iRoleCE: '0',
      iVipLevel: '0',
      iZoneAreaID: '200',
      vGameAppid: 'wxc155f0fadca13b22',
      vOpenID: '11977927157220015143',
      vRoleID: '17179902497',
      vRoleName: '?汐月?（缺木板盒钉找我',
    });
  }
  return data;
};

// 使用生成的一万条数据更新 tableData
const generateDataAndUpdateTable = async () => {
  tableData.value = generateData();
};

generateDataAndUpdateTable();
const refTable = ref(null);
const handleRowSelect = (...args) => {
  console.log('handleRowSelect', refTable.value.getSelection())
}

const handleSelectAll = (...agrs) => {
  console.log('handleSelectAll', refTable.value.getSelection())
}
</script>

<template>
  <div style="height: 400px;">
    <bk-table @select="handleRowSelect" @select-all="handleSelectAll" row-hover="auto" height="100%" :columns="columns"
      :data="tableData" show-overflow-tooltip ref="refTable" />
  </div>
</template>

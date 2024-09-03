<template>
  <bk-button @click="clearSelection">取消全选</bk-button>
  <bk-button @click="handleScrollTo">ScrollToLast</bk-button>
  <bk-button @click="handleAppendToLastRow">追加一行</bk-button>
  <div style="display: grid">
    <div style="height: 300px">
      <bk-table
        rowDraggable
        ref="refTable"
        :data="projectTable"
        height="auto"
        max-height="100%"
        stripe
        :fixedBottom="fixedBottom"
        show-overflow-tooltip
        :pagination="pagination"
      >
        <bk-table-column
          type="selection"
          :min-width="30"
          width="30"
          align="center"
        />
        <bk-table-column
          label="用户组"
          prop="groupName"
          :sort="true"
        />
        <bk-table-column
          label="用户描述"
          prop="groupDesc"
        />
        <bk-table-column
          label="有效期"
          prop="validityPeriod"
          :filter="filterOption"
        />
        <bk-table-column
          label="加入时间"
          prop="joinedTime"
        />
        <bk-table-column
          label="加入方式/操作人"
          prop="operateSource"
        >
          <template #default="{ row }"> {{ row.operateSource }}/{{ row.operator }} </template>
        </bk-table-column>
      </bk-table>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  const refTable = ref(null);

  const handleScrollTo = () => {
    refTable?.value.scrollTo(0, 1000);
  };

  const pagination = ref({ count: 11, limit: 10, current: 1 });
  const clearSelection = () => {
    refTable.value.clearSelection();
  };

  const filterList = reactive([]);
  const filterOption = computed(() => ({
    list: filterList,
    checked: [],
  }));

  const lastRowIndex = ref(10);

  const handleAppendToLastRow = () => {
    lastRowIndex.value = lastRowIndex.value + 1;
    projectTable.value.push({
      groupId: lastRowIndex.value,
      groupName: `last-group-${lastRowIndex.value}`,
      groupDesc: `last-des-${lastRowIndex.value}`,
      validityPeriod: `last-period-${lastRowIndex.value}`,
      joinedTime: '08-18',
      operateSource: `last-source-${lastRowIndex.value}`,
      operator: `last-operator-${lastRowIndex.value}`,
      removeMemberButtonControl: true,
    });
  };


  const fixedBottom = reactive({
    position: 'relative',
    height: 42,
  });
  const projectTable = ref([]);
  onMounted(() => {
    setTimeout(() => {
      projectTable.value = [
        {
          groupId: 1,
          groupName: '11',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0506',
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
          validityPeriod: '0605',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 4,
          groupName: '44',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0506',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 5,
          groupName: '55',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0605',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 6,
          groupName: '66',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0506',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 7,
          groupName: '77',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0605',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 8,
          groupName: '88',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0605',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 9,
          groupName: '99',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0605',
          joinedTime: '08-18',
          operateSource: '加入组',
          operator: '张三',
          removeMemberButtonControl: false,
        },
        {
          groupId: 10,
          groupName: '1010',
          groupDesc: 'kjkjkjk',
          validityPeriod: '0506',
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
      ];
    });

    setTimeout(() => {
      filterList.push(
        ...[
          { text: '0506', value: '0506' },
          { text: '0605', value: '0605' },
        ],
      );
    });
  });
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

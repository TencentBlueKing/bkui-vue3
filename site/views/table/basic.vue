<template>
  <div>
    <div style="margin-bottom: 12px;">
      <bk-checkbox v-model="stripe">斑马纹 (stripe)</bk-checkbox>
    </div>
    <bk-table
      :columns="columns"
      :data="tableData"
      :height="300"
      :stripe="stripe"
    />

    <h3 style="margin: 24px 0 12px;">height=auto + calc max-height + remote-pagination（异步加载）</h3>
    <bk-table
      :border="['outer']"
      :columns="remoteColumns"
      :data="remoteData"
      :pagination="remotePagination"
      height="auto"
      :max-height="'calc(100vh - 180px)'"
      :remote-pagination="true"
      @page-limit-change="handlePageLimitChange"
      @page-value-change="handlePageValueChange"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';

  const stripe = ref(false);

  const columns = reactive([
    { label: '名称', field: 'name' },
    { label: '来源', field: 'source' },
    { label: '状态', field: 'status' },
    { label: '创建时间', field: 'createTime' },
  ]);

  const tableData = ref([
    { name: '服务器-01', source: '腾讯云', status: '运行中', createTime: '2025-01-15 10:30:00' },
    { name: '服务器-02', source: '阿里云', status: '已停止', createTime: '2025-02-20 14:22:00' },
    { name: '服务器-03', source: '腾讯云', status: '运行中', createTime: '2025-03-10 09:15:00' },
    { name: '服务器-04', source: 'AWS', status: '运行中', createTime: '2025-04-05 16:48:00' },
    { name: '服务器-05', source: '腾讯云', status: '维护中', createTime: '2025-05-18 11:30:00' },
    { name: '服务器-06', source: '华为云', status: '运行中', createTime: '2025-06-01 08:00:00' },
    { name: '服务器-07', source: '腾讯云', status: '已停止', createTime: '2025-06-12 17:35:00' },
    { name: '服务器-08', source: 'AWS', status: '运行中', createTime: '2025-07-03 13:20:00' },
    { name: '服务器-09', source: '阿里云', status: '维护中', createTime: '2025-07-20 09:45:00' },
    { name: '服务器-10', source: '腾讯云', status: '运行中', createTime: '2025-08-08 15:10:00' },
  ]);

  // ---- remote-pagination + calc max-height 测试 ----

  const remoteColumns = reactive([
    { label: '插件名称', field: 'name', width: 160 },
    { label: '最新版本号', field: 'version', width: 140 },
    { label: '插件描述', field: 'desc' },
    { label: '更新人', field: 'updater', width: 120 },
    { label: '更新时间', field: 'updateTime', width: 180 },
  ]);

  const remoteData = ref([]);

  const remotePagination = reactive({
    current: 1,
    count: 3,
    limit: 10,
  });

  const mockFetchData = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { name: 'bksecbeat', version: '1.1.12', desc: '安全事件采集器', updater: 'admin', updateTime: '2025-12-17 14:25:52' },
          { name: 'bkhostc', version: '1.6.0', desc: '主机周期与常驻任务采集器', updater: 'admin', updateTime: '2025-12-17 14:25:52' },
          { name: 'bkkernc', version: '1.1.11', desc: '主机内核事件采集器', updater: 'admin', updateTime: '2025-12-17 14:25:52' },
        ]);
      }, 500);
    });
  };

  const fetchData = async () => {
    remoteData.value = await mockFetchData();
  };

  const handlePageValueChange = (page) => {
    remotePagination.current = page;
    fetchData();
  };

  const handlePageLimitChange = (limit) => {
    remotePagination.limit = limit;
    remotePagination.current = 1;
    fetchData();
  };

  onMounted(() => {
    fetchData();
  });
</script>

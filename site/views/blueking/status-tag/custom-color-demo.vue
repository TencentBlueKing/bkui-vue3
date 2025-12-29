<template>
  <div class="status-tag-demo">
    <h3>自定义状态映射 - 审批流程</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">待审批：</span>
        <status-tag
          status="pending"
          :status-map="approvalStatusMap"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">已批准：</span>
        <status-tag
          status="approved"
          :status-map="approvalStatusMap"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">已拒绝：</span>
        <status-tag
          status="rejected"
          :status-map="approvalStatusMap"
        ></status-tag>
      </div>
    </div>

    <h3>自定义状态映射 - 连接状态</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">已连接：</span>
        <status-tag
          status="connected"
          :status-map="connectionStatusMap"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">连接中：</span>
        <status-tag
          status="connecting"
          :status-map="connectionStatusMap"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">已断开：</span>
        <status-tag
          status="disconnected"
          :status-map="connectionStatusMap"
        ></status-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  const approvalStatusMap = JSON.stringify({
    pending: { text: '待审批', theme: 'warning' },
    approved: { text: '已批准', theme: 'running' },
    rejected: { text: '已拒绝', theme: 'stop' },
  });

  const connectionStatusMap = JSON.stringify({
    connected: { text: '已连接', theme: 'running' },
    connecting: { text: '连接中', theme: 'loading' },
    disconnected: { text: '已断开', theme: 'stop' },
  });

  onMounted(() => {
    // 确保 Web Component 已注册
    if (!customElements.get('status-tag')) {
      import('@blueking/status-tag');
    }
  });
</script>

<style scoped>
  .status-tag-demo {
    padding: 20px;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: center;
    margin-bottom: 24px;
  }

  .status-item {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .label {
    min-width: 80px;
    font-size: 12px;
    color: #63656e;
  }

  h3 {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #313238;
  }
</style>

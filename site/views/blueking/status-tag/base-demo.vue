<template>
  <div class="status-tag-demo">
    <h3>所有内置状态</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">加载中：</span>
        <status-tag status="loading"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">运行中：</span>
        <status-tag status="running"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">已停止：</span>
        <status-tag status="stop"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">警告：</span>
        <status-tag status="warning"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">失败：</span>
        <status-tag status="failed"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">未知：</span>
        <status-tag status="unknown"></status-tag>
      </div>
    </div>

    <h3>智能匹配（大小写不敏感）</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">RUNNING：</span>
        <status-tag status="RUNNING"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">Running：</span>
        <status-tag status="Running"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">running：</span>
        <status-tag status="running"></status-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

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
    min-width: 60px;
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

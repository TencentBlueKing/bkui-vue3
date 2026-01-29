<template>
  <div class="status-tag-demo">
    <h3>Default 类型（带背景框）</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">loading:</span>
        <status-tag status="loading"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">running:</span>
        <status-tag status="running"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">stop:</span>
        <status-tag status="stop"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">warning:</span>
        <status-tag status="warning"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">failed:</span>
        <status-tag status="failed"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">unknown:</span>
        <status-tag status="unknown"></status-tag>
      </div>
    </div>

    <h3>Stroke 类型（8px 描边）</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">loading:</span>
        <status-tag status="loading" type="stroke"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">running:</span>
        <status-tag status="running" type="stroke"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">stop:</span>
        <status-tag status="stop" type="stroke"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">warning:</span>
        <status-tag status="warning" type="stroke"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">failed:</span>
        <status-tag status="failed" type="stroke"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">unknown:</span>
        <status-tag status="unknown" type="stroke"></status-tag>
      </div>
    </div>

    <h3>Filled 类型（13px 光晕 + 7px 实心）</h3>
    <div class="demo-row">
      <div class="status-item">
        <span class="label">loading:</span>
        <status-tag status="loading" type="filled"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">running:</span>
        <status-tag status="running" type="filled"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">stop:</span>
        <status-tag status="stop" type="filled"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">warning:</span>
        <status-tag status="warning" type="filled"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">failed:</span>
        <status-tag status="failed" type="filled"></status-tag>
      </div>
      <div class="status-item">
        <span class="label">unknown:</span>
        <status-tag status="unknown" type="filled"></status-tag>
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


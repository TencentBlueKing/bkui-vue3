<template>
  <div class="installation-guide">
    <h3>安装</h3>
    <pre><code>npm install @blueking/status-tag</code></pre>

    <h3>在 Vue 3 项目中使用</h3>
    <div class="code-block">
      <pre><code>&lt;template&gt;
  &lt;div&gt;
    &lt;status-tag status="running"&gt;&lt;/status-tag&gt;
    &lt;status-tag status="loading"&gt;&lt;/status-tag&gt;
    &lt;status-tag status="warning"&gt;&lt;/status-tag&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { onMounted } from 'vue';

onMounted(() => {
  if (!customElements.get('status-tag')) {
    import('@blueking/status-tag');
  }
});
&lt;/script&gt;</code></pre>
    </div>

    <h3>实际效果</h3>
    <div class="demo-result">
      <status-tag status="loading"></status-tag>
      <status-tag status="running"></status-tag>
      <status-tag status="stop"></status-tag>
      <status-tag status="warning"></status-tag>
      <status-tag status="unknown"></status-tag>
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
  .installation-guide {
    padding: 20px;
  }

  h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #313238;
  }

  h3:first-child {
    margin-top: 0;
  }

  pre {
    padding: 16px;
    margin: 0;
    overflow-x: auto;
    background: #f5f7fa;
    border: 1px solid #dcdee5;
    border-radius: 2px;
  }

  code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.6;
    color: #313238;
  }

  .code-block {
    margin-bottom: 24px;
  }

  .demo-result {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: #fafbfd;
    border: 1px solid #dcdee5;
    border-radius: 2px;
  }
</style>

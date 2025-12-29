<template>
  <div class="status-tag-demo">
    <h3>国际化支持</h3>
    <div class="demo-controls">
      <button
        :class="{ active: currentLang === 'zh-CN' }"
        @click="setLanguage('zh-CN')"
      >
        中文
      </button>
      <button
        :class="{ active: currentLang === 'en-US' }"
        @click="setLanguage('en-US')"
      >
        English
      </button>
    </div>

    <div class="demo-row">
      <div class="status-item">
        <span class="label">加载中/Loading：</span>
        <status-tag
          status="loading"
          :locale="currentLang"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">运行中/Running：</span>
        <status-tag
          status="running"
          :locale="currentLang"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">已停止/Stopped：</span>
        <status-tag
          status="stop"
          :locale="currentLang"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">警告/Warning：</span>
        <status-tag
          status="warning"
          :locale="currentLang"
        ></status-tag>
      </div>
      <div class="status-item">
        <span class="label">未知/Unknown：</span>
        <status-tag
          status="unknown"
          :locale="currentLang"
        ></status-tag>
      </div>
    </div>

    <p class="hint">
      提示：组件会自动检测 Cookie 中的 blueking_language 设置，也可以手动指定 locale 属性
    </p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const currentLang = ref('zh-CN');

  const setLanguage = (lang: string) => {
    currentLang.value = lang;
  };

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

  .demo-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .demo-controls button {
    padding: 6px 16px;
    font-size: 12px;
    color: #63656e;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c6cc;
    border-radius: 2px;
  }

  .demo-controls button:hover {
    color: #3a84ff;
    border-color: #3a84ff;
  }

  .demo-controls button.active {
    color: #fff;
    background: #3a84ff;
    border-color: #3a84ff;
  }

  .demo-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .status-item {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .label {
    min-width: 140px;
    font-size: 12px;
    color: #63656e;
  }

  .hint {
    padding: 12px;
    margin-top: 16px;
    font-size: 12px;
    line-height: 1.6;
    color: #63656e;
    background: #f5f7fa;
    border-radius: 2px;
  }

  h3 {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #313238;
  }
</style>

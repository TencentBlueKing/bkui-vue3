<template>
  <div class="popover-global-config-demo">
    <section class="demo-section">
      <h4>模块内配置</h4>
      <p>
        使用 <code>bk-config-provider</code> 的 <code>popover-render-reference-wrapper</code> 可以为当前子树统一配置
        Popover 是否渲染 reference 包裹容器。设置为 <code>false</code> 时，单个 DOM 或组件节点会尽量保持原 DOM 结构不变；文本和多节点会自动降级包裹一层
        <code>span</code>，用于事件绑定和定位。
      </p>
      <div class="demo-row">
        <bk-config-provider :popover-render-reference-wrapper="false">
          <bk-popover
            content="来自模块内 bk-config-provider：不主动追加 reference span"
            trigger="click"
          >
            <button class="native-trigger">模块内无包裹</button>
          </bk-popover>

          <bk-popover
            content="组件节点也会解析为真实 DOM 作为 reference"
            trigger="click"
          >
            <bk-button>组件节点</bk-button>
          </bk-popover>
        </bk-config-provider>
      </div>
      <pre><code>{{ moduleConfigCode }}</code></pre>
    </section>

    <section class="demo-section">
      <h4>单个 Popover 覆盖全局配置</h4>
      <p>
        <code>render-reference-wrapper</code> 的优先级高于 <code>bk-config-provider</code>。
        当子树全局配置为 <code>false</code> 时，仍可在单个 Popover 上设置为 <code>true</code> 恢复包裹容器模式。
      </p>
      <div class="demo-row">
        <bk-config-provider :popover-render-reference-wrapper="false">
          <bk-popover
            :render-reference-wrapper="true"
            content="当前 Popover 显式恢复 reference wrapper"
            trigger="click"
          >
            <bk-button>局部恢复包裹</bk-button>
          </bk-popover>

          <bk-popover
            :render-reference-wrapper="false"
            content="当前 Popover 显式保持原 DOM 结构"
            trigger="click"
          >
            <button class="native-trigger">局部无包裹</button>
          </bk-popover>
        </bk-config-provider>
      </div>
      <pre><code>{{ propOverrideCode }}</code></pre>
    </section>

    <section class="demo-section">
      <h4>项目初始化全局配置</h4>
      <p>
        如果希望整个项目默认不主动追加 Popover reference 包裹容器，可以在应用初始化时通过
        <code>app.use(BkUI, options)</code> 传入全局配置。该配置会作为默认值被所有 Popover 读取，单个组件仍可通过
        <code>render-reference-wrapper</code> 覆盖。
      </p>
      <pre><code>{{ projectInitCode }}</code></pre>
    </section>

    <section class="demo-section">
      <h4>配置优先级</h4>
      <ul>
        <li><code>bk-popover render-reference-wrapper</code>：优先级最高，只影响当前 Popover。</li>
        <li><code>bk-config-provider popover-render-reference-wrapper</code>：影响当前 Provider 子树内的 Popover。</li>
        <li>未配置时：保持默认包裹容器模式，兼容历史行为。</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
  const moduleConfigCode = `<bk-config-provider :popover-render-reference-wrapper="false">
  <bk-popover content="提示内容" trigger="click">
    <button>模块内无包裹</button>
  </bk-popover>

  <bk-popover content="提示内容" trigger="click">
    <bk-button>组件节点</bk-button>
  </bk-popover>
</bk-config-provider>`;

  const propOverrideCode = `<bk-config-provider :popover-render-reference-wrapper="false">
  <!-- 当前 Popover 显式恢复 reference wrapper -->
  <bk-popover :render-reference-wrapper="true" content="提示内容">
    <bk-button>局部恢复包裹</bk-button>
  </bk-popover>

  <!-- 当前 Popover 显式保持原 DOM 结构 -->
  <bk-popover :render-reference-wrapper="false" content="提示内容">
    <button>局部无包裹</button>
  </bk-popover>
</bk-config-provider>`;

  const projectInitCode = `import { createApp } from 'vue';
import BkUI from 'bkui-vue';
import App from './App.` + `vue';

const app = createApp(App);

app.use(BkUI, {
  // false：Popover 默认不主动追加 reference 包裹容器
  // true 或不配置：保持默认包裹容器模式
  popoverRenderReferenceWrapper: false,
});

app.mount('#app');`;
</script>

<style scoped>
.popover-global-config-demo {
  color: #63656e;
  line-height: 20px;
}

.demo-section + .demo-section {
  margin-top: 20px;
}

.demo-section h4 {
  margin: 0 0 8px;
  color: #313238;
  font-size: 14px;
  font-weight: 600;
}

.demo-section p {
  margin: 0 0 12px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.demo-row :deep(.bk-config-provider),
.demo-row :deep(.bk-popover) {
  display: contents;
}

.native-trigger {
  height: 32px;
  padding: 0 16px;
  color: #63656e;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c6cc;
  border-radius: 2px;
}

pre {
  padding: 12px 16px;
  margin: 0;
  overflow: auto;
  color: #c4c6cc;
  background: #1f2329;
  border-radius: 2px;
}

code {
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
}

ul {
  padding-left: 20px;
  margin: 0;
}
</style>

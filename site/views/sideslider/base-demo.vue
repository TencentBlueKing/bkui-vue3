<template>
  <div>
    <bk-button
      theme="primary"
      text
      @click="handleOpen"
    >
      打开侧栏
    </bk-button>

    <bk-sideslider
      v-model:isShow="isShow"
      title="我是标题"
      renderDirective="if"
    >
      <div class="sideslider-body">
        hello world!!!
        <div class="tooltip-test">
          <span
            class="tooltip-trigger"
            v-bk-tooltips="{ content: shortTip }"
          >
            悬停看短提示
          </span>
          <span
            class="tooltip-trigger"
            v-bk-tooltips="{ content: longTip, trigger: 'click' }"
          >
            悬停看超宽提示
          </span>
        </div>
      </div>
    </bk-sideslider>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { bkTooltips } from 'bkui-vue';

  const vBkTooltips = bkTooltips;
  const isShow = ref(false);
  const shortTip = '短提示内容';
  const longTip =
    '这是一段超长 Tooltip 内容，用于测试在 Sideslider 侧栏内展示时是否会溢出或被裁剪。当内容宽度超过侧栏或视口时，需要确认 Tooltip 的定位与 overflow 表现是否符合预期。可以继续追加更多文字以拉长宽度：例如重复这句话多次——超宽测试、超宽测试、超宽测试、超宽测试、超宽测试。';

  const handleOpen = () => {
    isShow.value = true;
  };
</script>

<style scoped>
  .sideslider-body {
    padding: 8px 0;
  }
  .tooltip-test {
    margin-top: 16px;
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  .tooltip-trigger {
    padding: 8px 12px;
    background: #f0f1f5;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

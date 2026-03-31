<template>
  <div>
    <bk-button
      theme="primary"
      text
      @click="handleOpenRight"
    >
      右侧可拖拽侧栏
    </bk-button>
    <bk-button
      style="margin-left: 10px"
      theme="primary"
      text
      @click="handleOpenLeft"
    >
      左侧可拖拽侧栏
    </bk-button>
    <bk-button
      style="margin-left: 10px"
      theme="primary"
      text
      @click="handleOpenImmediate"
    >
      实时拖拽模式
    </bk-button>

    <bk-sideslider
      v-model:isShow="isShowRight"
      :max-width="1200"
      :min-width="400"
      :resizable="true"
      title="右侧可拖拽侧栏"
      @after-resize="handleAfterResize"
      @before-resize="handleBeforeResize"
      @resizing="handleResizing"
    >
      <div style="padding: 20px">
        <p>这是一个可以拖拽调整宽度的侧栏</p>
        <p>拖拽左侧边缘可以调整宽度</p>
        <p>最小宽度: 400px</p>
        <p>最大宽度: 1200px</p>
        <p style="margin-top: 20px">当前宽度: {{ currentWidthRight }}px</p>
      </div>
    </bk-sideslider>

    <bk-sideslider
      v-model:isShow="isShowLeft"
      :min-width="300"
      :resizable="true"
      direction="left"
      title="左侧可拖拽侧栏"
      @after-resize="handleAfterResizeLeft"
      @before-resize="handleBeforeResize"
      @resizing="handleResizingLeft"
    >
      <div style="padding: 20px">
        <p>这是一个可以拖拽调整宽度的侧栏</p>
        <p>拖拽右侧边缘可以调整宽度</p>
        <p>最小宽度: 300px</p>
        <p>最大宽度: 800px</p>
        <p style="margin-top: 20px">当前宽度: {{ currentWidthLeft }}px</p>
      </div>
    </bk-sideslider>

    <bk-sideslider
      v-model:isShow="isShowImmediate"
      :immediate="true"
      :max-width="1000"
      :min-width="400"
      :resizable="true"
      title="实时拖拽模式"
      @after-resize="handleAfterResizeImmediate"
      @before-resize="handleBeforeResize"
      @resizing="handleResizingImmediate"
    >
      <div style="padding: 20px">
        <p>这是实时拖拽模式</p>
        <p>拖拽时侧栏宽度会实时改变</p>
        <p>不会显示蓝色辅助线</p>
        <p>最小宽度: 500px</p>
        <p>最大宽度: 1000px</p>
        <p style="margin-top: 20px">当前宽度: {{ currentWidthImmediate }}px</p>
      </div>
    </bk-sideslider>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const isShowRight = ref(false);
  const isShowLeft = ref(false);
  const isShowImmediate = ref(false);
  const currentWidthRight = ref(400);
  const currentWidthLeft = ref(400);
  const currentWidthImmediate = ref(500);

  const handleOpenRight = () => {
    isShowRight.value = true;
    currentWidthRight.value = 400;
  };

  const handleOpenLeft = () => {
    isShowLeft.value = true;
    currentWidthLeft.value = 400;
  };

  const handleOpenImmediate = () => {
    isShowImmediate.value = true;
    currentWidthImmediate.value = 500;
  };

  const handleBeforeResize = (event: Event) => {
    console.log('开始拖拽', event);
  };

  const handleResizing = (width: number) => {
    currentWidthRight.value = Math.round(width);
  };

  const handleAfterResize = (width: number) => {
    console.log('拖拽结束，最终宽度：', width);
    currentWidthRight.value = Math.round(width);
  };

  const handleResizingLeft = (width: number) => {
    currentWidthLeft.value = Math.round(width);
  };

  const handleAfterResizeLeft = (width: number) => {
    console.log('拖拽结束，最终宽度：', width);
    currentWidthLeft.value = Math.round(width);
  };

  const handleResizingImmediate = (width: number) => {
    currentWidthImmediate.value = Math.round(width);
  };

  const handleAfterResizeImmediate = (width: number) => {
    console.log('实时拖拽结束，最终宽度：', width);
    currentWidthImmediate.value = Math.round(width);
  };
</script>

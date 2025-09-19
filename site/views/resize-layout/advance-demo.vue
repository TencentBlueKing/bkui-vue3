<template>
  <bk-resize-layout
    style="height: 500px"
    collapsible
  >
    <template #aside>
      <bk-resize-layout
        style="height: 100%"
        :border="false"
        placement="top"
        collapsible
      >
        <template #aside>
          <div>aside-top</div>
        </template>
        <template #main>
          <div>main-1</div>
        </template>
      </bk-resize-layout>
    </template>
    <template #main>
      <bk-resize-layout
        style="height: 100%"
        :border="false"
        placement="bottom"
        collapsible
      >
        <template #aside>
          <div>aside-bottom</div>
        </template>
        <template #main>
          <bk-resize-layout
            style="height: 100%"
            :border="false"
            placement="right"
            collapsible
          >
            <template #aside>
              <div>aside-right</div>
            </template>
            <template #main>
              <div>main-3</div>
            </template>
          </bk-resize-layout>
        </template>
      </bk-resize-layout>
    </template>
  </bk-resize-layout>
</template>
<script setup>
  import BkResizeLayout from '@bkui-vue/resize-layout';
</script>

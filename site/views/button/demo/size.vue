<template>
  <div class="button-group-list">
    <div class="mb10 basic-button-list">
      <span>小尺寸</span>
      <bk-button
        class="ml10"
        size="small"
      >
        基础按钮
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        <plus />
        新增
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        下拉
        <angle-down />
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        size="small"
      >
        <bk />
        成功
      </bk-button>
    </div>

    <div class="mb10 basic-button-list">
      <span>默认尺寸</span>
      <bk-button
        class="ml10"
      >
        基础按钮
      </bk-button>
      <bk-button class="ml10">
        <plus />
        新增
      </bk-button>
      <bk-button class="ml10">
        下拉
        <angle-down />
      </bk-button>
      <bk-button
        class="ml10"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        loading
      />
      <bk-button class="ml10">
        <bk />
        成功
      </bk-button>
    </div>

    <div class="basic-button-list">
      <span>大尺寸</span>
      <bk-button
        class="ml10"
        size="large"
      >
        基础按钮
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        <plus />
        新增
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        下拉
        <angle-down />
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        size="large"
      >
        <bk />
        成功
      </bk-button>
    </div>
  </div>
</template>

<script setup>
  import { AngleDown, Bk, Plus } from '@bkui-vue/icon';
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
  }
</style>

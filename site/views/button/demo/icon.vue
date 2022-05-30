<template>
  <div class="basic-button-list">
    <bk-button>
      <plus />
      新增
    </bk-button>
    <bk-button
      theme="primary"
      class="ml10"
    >
      下拉
      <angle-down />
    </bk-button>
    <bk-button
      class="ml10"
    >
      <search />
    </bk-button>
    <bk-button
      class="ml10"
      theme="primary"
      circle
    >
      <search />
    </bk-button>
    <bk-button
      class="ml10"
    >
      <loading
        loading
        size="mini"
        mode="spin"
      />
      loading
    </bk-button>
    <bk-button
      class="ml10"
      loading
    />
    <bk-button
      theme="primary"
      class="ml10"
      loading
    />
    <bk-button
      class="ml10"
      loading
      loading-mode="spin"
    />
    <bk-button
      class="ml10"
      theme="primary"
      loading
      loading-mode="spin"
    />
  </div>
</template>

<script setup>
  import { AngleDown, Plus, Search } from '@bkui-vue/icon';
  import Loading from '@bkui-vue/loading';
</script>

<style lang="postcss">
  .ml10 {
    margin-left: 10px;
  }
</style>

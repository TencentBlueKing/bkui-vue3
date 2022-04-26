<template>
  <div>
    <bk-input
      class="mb10"
    >
      <template #prefix>
        <span class="input-icon">
          <search />
        </span>
      </template>
    </bk-input>

    <bk-input class="mb10">
      <template #suffix>
        <span class="input-icon">
          <info-line />
        </span>
      </template>
    </bk-input>
  </div>
</template>

<script setup>
  import { InfoLine, Search } from '@bkui-vue/icon';

</script>

<style lang="postcss" scoped>
  .input-icon {
    display: block;
    padding: 0 10px;
    font-size: 16px;
    color: #c4c6cc;
    align-self: center;
  }
</style>



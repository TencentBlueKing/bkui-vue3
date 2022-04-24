<template>
  <div>
    <bk-input
      class="mb10"
      type="url"
      prefix="https://"
    />
    <bk-input class="mb10">
      <template #prefix>
        <span class="prefix-slot">prefix</span>
      </template>
    </bk-input>
    <bk-input
      class="mb10"
      type="url"
      suffix="@qq.com"
    />
    <bk-input class="mb10">
      <template #suffix>
        <span class="suffix-slot">suffix</span>
      </template>
    </bk-input>
  </div>
</template>

<style lang="postcss" scoped>
  .prefix-slot,
  .suffix-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    background: #e1ecff;
  }
</style>

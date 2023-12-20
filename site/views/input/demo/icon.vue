<template>
  <div>
    <bk-input
      class="mb8"
    >
      <template #prefix>
        <span class="input-icon">
          <search />
        </span>
      </template>
    </bk-input>

    <bk-input class="mb8">
      <template #suffix>
        <span class="input-icon suffix-icon">
          <info-line />
        </span>
      </template>
    </bk-input>
  </div>
</template>

<script setup>
  import { InfoLine, Search } from 'bkui-vue/lib/icon';

</script>

<style lang="postcss" scoped>
.mb8 {
  margin-bottom: 8px;
}
.input-icon {
  display: flex;
  padding-left: 8px;
  font-size: 16px;
  color: #c4c6cc;
  align-items: center;
  justify-content: center;
}

.suffix-icon {
  padding-right: 8px;
}
</style>



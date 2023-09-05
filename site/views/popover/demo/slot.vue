<template>
  <bk-popover
    disable-outside-click
    :offset="16"
    placement="top"
    theme="light"
    width="490"
  >
  超长
    <template #content>
      <div>
        <ContentTable></ContentTable>
      </div>
    </template>
  </bk-popover>
</template>
<script setup>
import ContentTable from '../../table/column-template.vue';
</script>

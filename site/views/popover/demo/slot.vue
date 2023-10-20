<template>
  <bk-popover
    disable-outside-click
    :component-event-delay="300"
    :offset="16"
    placement="top"
    theme="light"
    width="490"
  >
    超长
    <template #content>
      <div>
        <content-table />
      </div>
    </template>
  </bk-popover>
</template>
<script setup>
  import ContentTable from '../../table/column-template.vue';
</script>

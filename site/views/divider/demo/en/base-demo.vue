<template>
  <div>
    <div>Paragraph 1</div>
    <bk-divider>Divider</bk-divider>
    <div>Paragraph 2</div>
    <bk-divider align="left">
      Divider
    </bk-divider>
    <div>Paragraph 3</div>
    <bk-divider align="right">
      Divider
    </bk-divider>
    <div>Paragraph 4</div>
    <bk-divider type="dashed">
      Divider
    </bk-divider>
    <div>Paragraph</div>
    <bk-divider direction="vertical" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {},
  });
</script>

<template>
  <bk-collapse-panel v-model="active">
    <span>collapse-panel: Mature scheme</span>
    <template #content>
      <div>
        With the experience of supporting hundreds of Tencent businesses, compatible with
        various complex system architectures, born in O&M and proficient in O&M
      </div>
    </template>
  </bk-collapse-panel>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const active = ref(true);

      return {
        active,
      };
    },
  });
</script>

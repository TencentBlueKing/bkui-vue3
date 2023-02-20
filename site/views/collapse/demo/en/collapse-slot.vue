<template>
  <bk-collapse v-model="activeIndex">
    <bk-collapse-panel :name="1">
      <span>Mature scheme</span>
      <template #content>
        <div>
          With the experience of supporting hundreds of Tencent businesses, compatible
          with various complex system architectures, born in O&M and proficient in O&M
        </div>
      </template>
    </bk-collapse-panel>
    <bk-collapse-panel :name="2">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>Comprehensive coverage</div>
          <div>
            {{ activeIndex.includes(2) ? "Expand" : "Collapse" }}
          </div>
        </div>
      </template>
      <template #content>
        <div>
          With the experience of supporting hundreds of Tencent businesses, compatible
          with various complex system architectures, born in O&M and proficient in O&M
        </div>
      </template>
    </bk-collapse-panel>
  </bk-collapse>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkCollapse from '@bkui-vue/collapse';
  export default defineComponent({
    components: {
      BkCollapse,
    },
    setup() {
      const activeIndex = ref([0]);

      return {
        activeIndex,
      };
    },
  });
</script>

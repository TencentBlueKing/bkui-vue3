<template>
  <bk-collapse
    :list="list"
  >
    <template #title="slotProps">
      <span> {{ slotProps.name }} {{ title }}</span>
    </template>
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
      const title = ref('Custom title');
      const list = ref([
        {
          name: 'Mature scheme',
          content:
            'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
        },
        {
          name: 'Comprehensive coverage',
          content:
            'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
        },
        {
          name: 'Open platform',
          content:
            'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
        },
      ]);

      return {
        title,
        list,
      };
    },
  });
</script>

<template>
  <bk-select
    v-model="data"
    custom-content
    multiple-mode="tag"
    multiple
    :placeholder="'Please select'"
    :search-placeholder="'Please enter keywords'"
    :no-data-text="'No data'"
    :no-match-text="'No matching data'"
    :loading-text="'Loading...'"
  >
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
      @node-click="handleNodeClick"
    />
  </bk-select>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const data = ref([]);
      const treeData = ref([
        {
          name: 'Mature scheme',
          isOpen: true,
          content:
            'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
          id: '/',
          children: [
            {
              name:
                'child-1-Mature scheme-With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
              content:
                'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
              children: [],
            },
            {
              name: 'child-1-Comprehensive coverage',
              content:
                'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
              children: [],
            },
            {
              name: 'child-1-open platform',
              content:
                'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
              children: [
                {
                  name: 'child-1-Mature scheme',
                  content:
                    'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
                  children: [],
                },
                {
                  name: 'child-1-Comprehensive coverage',
                  content:
                    'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
                  children: [],
                },
                {
                  name: 'child-1-open platform',
                  isOpen: true,
                  content:
                    'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Comprehensive coverage',
          content:
            'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
          id: '//',
          children: [
            {
              name: 'child-2-Mature scheme',
              content:
                'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
              children: [],
            },
            {
              name: 'child-2-Comprehensive coverage',
              content:
                'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
              children: [],
            },
            {
              name: 'child-2-open platform',
              content:
                'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
              children: [],
            },
          ],
        },
        {
          name: 'Open platform',
          content:
            'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
          children: [
            {
              name: 'child-3-Mature scheme',
              content:
                'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
              children: [],
            },
            {
              name: 'child-3-Comprehensive coverage',
              content:
                'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
              children: [],
            },
            {
              name: 'child-3-open platform',
              content:
                'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
              children: [],
            },
          ],
        },
      ]);

      const handleNodeClick = (item) => {
        const index = data.value.indexOf(item.name);
        if (index > -1) {
          data.value.splice(index, 1);
        } else {
          data.value.push(item.name);
        }
      };

      return {
        treeData,
        data,
        handleNodeClick,
      };
    },
  });
</script>

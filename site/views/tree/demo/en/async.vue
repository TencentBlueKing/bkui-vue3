<template>
  <div class="row">
    <div class="cell">
      <bk-tree
        ref="refAutoSelect"
        :data="treeData"
        :selected="selected"
        node-key="id"
        :async="{
          callback: getRemoteData,
          cache: true,
        }"
        level-line
        label="name"
        children="children"
        :auto-check-children="false"
      />
    </div>
    <div class="cell">
      <bk-input
        v-model="selected2"
        :placeholder="'Set selected id'"
      />
      <bk-tree
        ref="refAutoSelect"
        :data="treeData2"
        :selected="selected2"
        node-key="id"
        level-line
        label="name"
        children="children"
        :auto-check-children="false"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { ASYNC_DATA, SINGLE_NODE_DATA } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      const id = new Date().getTime();
      const refAutoSelect = ref();
      const treeData = ref([...ASYNC_DATA].map(item => ({ ...item })));
      const treeData2 = ref([...SINGLE_NODE_DATA].map(item => ({ ...item })));
      const selected = ref(null);
      const selected2 = ref('/');
      const rootId = ref(Math.random() * id);

      const handleNodeExpand = (item, data, schema) => {
        console.log('handleNodeExpand', item, data, schema);
      };

      const getRemoteData = (_item, _callback, _schema) => {
        rootId.value = rootId.value + Math.ceil(Math.random() * 1000);
        return new Promise(resolve => setTimeout(
          () => resolve({
            name: 'Open platform',
            id: rootId.value + 1,
            content:
              'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
            children: [
              {
                id: rootId.value + 2,
                name: 'Child-3-mature scheme',
                content:
                  'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
                children: [],
              },
              {
                id: rootId.value + 3,
                name: 'Child-3 - comprehensive coverage',
                content:
                  'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
                children: [],
              },
              {
                id: rootId.value + 4,
                name: 'Child-3-open platform',
                content:
                  'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
                children: [],
              },
            ],
          }),
          300,
        ));
      };

      return {
        refAutoSelect,
        selected,
        selected2,
        treeData,
        treeData2,
        handleNodeExpand,
        getRemoteData,
      };
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
  height: 300px;
  overflow: auto;
}

.cell {
  width: 33%;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>

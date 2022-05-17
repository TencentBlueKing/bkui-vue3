<template>
  <div class="row">
    <div class="cell">
      自行处理异步请求返回数据节点追加 & Loading
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
        sync-action
        @nodeExpand="handleNodeExpand"
      />
    </div>
    <div class="cell">
      内置处理异步请求返回数据节点追加
      <bk-tree
        ref="refAutoSelect"
        :data="treeData2"
        :selected="selected"
        node-key="id"
        :async="{
          callback: getRemoteData2,
          cache: true,
        }"
        level-line
        label="name"
        children="children"
        :auto-check-children="false"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { ASYNC_DATA } from './options';
  const id = new Date().getTime();
  export default defineComponent({
    components: {},
    data() {
      return {
        treeData: [...ASYNC_DATA].map(item => ({ ...item })),
        treeData2: [...ASYNC_DATA].map(item => ({ ...item })),
        selected: null,
        rootId: Math.random() * id,
      };
    },
    methods: {
      handleNodeExpand(item, data, schema) {
        console.log('handleNodeExpand', item, data, schema);
      },
      getRemoteData(item, callback, schema) {
        const { isOpened, fullPath } = schema;
        const paths = fullPath.split('-');
        const targetNode = paths.reduce((pre, nodeIndex) => {
          const index = Number(nodeIndex);
          return  Array.isArray(pre) ? pre[index] : pre.children[index];
        }, this.treeData);
        targetNode.loading = true;
        this.rootId = this.rootId + 100;
        !isOpened && setTimeout(
          () => {
            targetNode.children.push({
              name: '开放平台',
              id: this.rootId + 1,
              content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
              children: [
                {
                  id: this.rootId + 2,
                  name: 'child-3-方案成熟',
                  content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
                  children: [],
                },
                {
                  id: this.rootId + 3,
                  name: 'child-3-覆盖全面',
                  content:
                    '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
                  children: [],
                },
                {
                  id: this.rootId + 4,
                  name: 'child-3-开放平台',
                  content:
                    '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
                  children: [],
                },
              ],
            });
            targetNode.loading = false;
          },
          300,
        );

        targetNode.isOpen = true;
      },
      getRemoteData2(_item, _callback, _schema) {
        this.rootId = this.rootId + Math.ceil(Math.random() * 1000);
        return new Promise(resolve => setTimeout(() => resolve({
          name: '开放平台',
          id: this.rootId + 1,
          async: false,
          content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
          children: [
            {
              id: this.rootId + 2,
              name: 'child-3-方案成熟',
              content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
              children: [],
            },
            {
              id: this.rootId + 3,
              name: 'child-3-覆盖全面',
              content:
                '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
              children: [],
            },
            {
              id: this.rootId + 4,
              name: 'child-3-开放平台',
              content:
                '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
              children: [],
            },
          ],
        }), 300));
      },
      handleAutoSelect() {
        const treeData = this.$refs.refAutoSelect.getData();
        const { length } = treeData.data;
        const randomIndex = Math.floor(Math.random() * length);
        this.selected = treeData.data[randomIndex];
      },
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

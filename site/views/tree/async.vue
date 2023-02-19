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
        :placeholder="t('设置选中id')"
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
  import { useI18n } from 'vue-i18n';

  import { ASYNC_DATA, SINGLE_NODE_DATA } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
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
            name: t('开放平台'),
            id: rootId.value + 1,
            content: t('开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。'),
            children: [
              {
                id: rootId.value + 2,
                name: t('child-3-方案成熟'),
                content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
                children: [],
              },
              {
                id: rootId.value + 3,
                name: t('child-3-覆盖全面'),
                content: t('从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。'),
                children: [],
              },
              {
                id: rootId.value + 4,
                name: t('child-3-开放平台'),
                content: t('开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。'),
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
        t,
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

<template>
  <div style="height: 300px; width: 100%; overflow: auto;">
    <bk-tree
      :data="treeData"
      :async="{
        callback: getRemoteData,
        cache: true,
      }"
      :level-line="true"
      label="name"
      children="children"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { ASYNC_DATA } from './options';
export default defineComponent({
  components: {},
  data() {
    return {
      treeData: [...ASYNC_DATA].map(item => ({ ...item, async: true })),
    };
  },
  methods: {
    getRemoteData(item) {
      console.log('get remote data', item);
      return new Promise((resolve) => {
        setTimeout(
          () => resolve({
            name: '开放平台',
            content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
            children: [
              {
                name: 'child-3-方案成熟',
                content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
                children: [],
              },
              {
                name: 'child-3-覆盖全面',
                content:
                    '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
                children: [],
              },
              {
                name: 'child-3-开放平台',
                content:
                    '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
                children: [],
              },
            ],
          }),
          300,
        );
      });
    },
  },
});
</script>

<template>
  <div style=" width: 100%;height: 300px; overflow: auto;">
    <div>
      <bk-input
        v-model="selectText"
        style="width: 120px;margin: 0 15px 0 0;"
      />
      <bk-button>
        测试选中
      </bk-button>
    </div>
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
      show-checkbox
      level-line
      node-key="id"
      :selected="selected"
      :auto-open-parent-node="false"
      @node-click="handleNodeClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {},
    data() {
      return {
        selectText: '2',
        selected: [{ id: '1', name: '方案成熟', isOpen: true, content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维' }],
        treeData: [
          {
            id: '1', name: '方案成熟', isOpen: true, content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
            children: [
              { id: '2', name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
              { id: '3', name: 'child-1-覆盖全面', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
              { id: '4', name: 'child-1-开放平台', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [
                { id: '5', name: 'child-1-方案成熟', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
                { id: '6', name: 'child-1-覆盖全面', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
                { id: '7', name: 'child-1-开放平台', isOpen: true, content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [] },
              ] },
            ],
          },

        ],
      };
    },
    methods: {
      handleSelect() {
        this.selected = [this.selectText];
      },
    },
  });
</script>

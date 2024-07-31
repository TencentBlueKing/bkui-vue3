<template>
  <div class="row">
    <div class="column">
      <bk-input style="width: 120px; margin: 0 15px 0 0" v-model="selectText" />
      <bk-button @click="handleSelect"> 测试选中 </bk-button>
      <div class="cell">
        <bk-tree ref="refAutoSelect" :auto-open-parent-node="false" :data="treeData" :selected="selected" selectable
          children="children" label="name" node-key="id" level-line show-checkbox @node-selected="handleNodeSelected" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
const cache = new WeakMap();
export default defineComponent({
  components: {},
  data() {
    return {
      selectText: '2',
      selected: ['2'],
      treeData: [
        {
          id: '1',
          name: '方案成熟',
          isOpen: true,
          content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
          children: [
            {
              id: '2',
              name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
              content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
              children: [],
            },
            {
              id: '3',
              name: 'child-1-覆盖全面',
              content:
                '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
              children: [],
            },
            {
              id: '4',
              name: 'child-1-开放平台',
              content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
              children: [
                {
                  id: '5',
                  name: 'child-1-方案成熟',
                  content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
                  children: [],
                },
                {
                  id: '6',
                  name: 'child-1-覆盖全面',
                  content:
                    '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
                  children: [],
                },
                {
                  id: '7',
                  name: 'child-1-开放平台',
                  isOpen: true,
                  content:
                    '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleSelect() {
      this.selected = [this.selectText];
    },
    handleNodeSelected(...args) {
      console.log(args);
      if (cache.get(args[0].node)) {
        setTimeout(() => {
          this.$refs.refAutoSelect.setOpen(args[0].node, false);
        });
        cache.delete(args[0].node);
        return;
      }

      cache.set(args[0].node, true);
      // this.$refs.refAutoSelect.setNodeOpened()
    },
  },
});
</script>
<style scoped>
@import './tree.less';
</style>

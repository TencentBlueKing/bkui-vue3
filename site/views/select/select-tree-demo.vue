<template>
  <bk-select
    :model-value="data"
    custom-content
    multiple-mode="tag"
    multiple
    @tag-remove="handleRemoveTag"
  >
    <bk-tree
      ref="treeRef"
      :data="treeData"
      label="name"
      children="children"
      show-checkbox
      style="color: #63656e;"
      @node-checked="handleNodeChecked"
    />
  </bk-select>
</template>
<script setup>
  import { computed, ref } from 'vue';

  const treeData = ref([
    {
      name: '方案成熟', isOpen: true, content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', id: '1',
      children: [
        { name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', id: '1-1', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
        { name: 'child-1-覆盖全面', id: '1-2', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
        { name: 'child-1-开放平台', id: '1-3', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [
          { name: 'child-1-方案成熟', id: '1-3-1', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
          { name: 'child-1-覆盖全面', id: '1-3-2', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
          { name: 'child-1-开放平台', id: '1-3-3', isOpen: true, content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [] },
        ] },
      ],
    },
    {
      name: '覆盖全面', id: '2', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', id: '//',
      children: [
        { name: 'child-2-方案成熟', id: '2-1', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
        { name: 'child-2-覆盖全面', id: '2-2', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
        { name: 'child-2-开放平台', id: '2-3', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [] },
      ],
    },
    {
      name: '开放平台', id: '3', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
      children: [
        { name: 'child-3-方案成熟', id: '3-1', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维', children: [] },
        { name: 'child-3-覆盖全面', id: '3-2', content: '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。', children: [] },
        { name: 'child-3-开放平台', id: '3-3', content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。', children: [] },
      ],
    },
  ]);
  const checked = ref([]);
  const data = computed(() => checked.value.filter(item => !item.children?.length).map(item => item.name));
  const treeRef = ref();
  const handleNodeChecked = (item) => {
    checked.value = item;
  };
  const handleRemoveTag = (name) => {
    const node = checked.value.find(node => node.name === name);
    treeRef.value.setChecked(node, false);
  };
</script>

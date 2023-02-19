<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
    >
      <template #add>
        <div @click="addPanel">
          + 新增
        </div>
      </template>
      <template #setting>
        <div style="margin: 0 10px">
          设置
        </div>
      </template>

      <bk-tab-panel
        v-for="(item,index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <template #label>
          <div>自定义标签: {{ index }}---{{ item.name }}</div>
        </template>
        <template #panel>
          <div>
            自定义内容: {{ item.label }}
          </div>
        </template>
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {},
    setup() {
      const active = ref('mission');
      const panels = ref([
        { name: 'mission', label: '任务报表', count: 10 },
        { name: 'config', label: '加速配置', count: 20 },
        { name: 'history', label: '历史版本', count: 30 },
        { name: 'deleted', label: '已归档加速任务', count: 40 },
      ]);

      const tabChange = (name) => {
        console.log(name);
      };

      const changeActive = (name) => {
        active.value = name;
      };

      const addPanel = () => {
        const name = Math.random().toString(16)
          .substring(4, 10);
        panels.value.push({
          name,
          label: `新标签页-${name.substring(0, 4)}`,
          count: 50,
        });
        active.value = name;
      };

      const removePanel = (index, panel) => {
        console.log(panel);
        panels.value.splice(index, 1);
      };

      const tabSort = (dragStartIndex, index) => {
        console.log(dragStartIndex, index);
      };

      const tabDrag = (index, $event) => {
        console.log(index, $event);
      };

      return {
        active,
        panels,
        tabChange,
        changeActive,
        addPanel,
        removePanel,
        tabSort,
        tabDrag,
      };
    },
  });
</script>

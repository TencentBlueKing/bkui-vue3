<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
    >
      <template #add>
        <div @click="addPanel">
          + {{ t("新增") }}
        </div>
      </template>
      <template #setting>
        <div style="margin: 0 10px">
          {{ t("设置") }}
        </div>
      </template>

      <bk-tab-panel
        v-for="(item,index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <template #label>
          <div>{{ `${t("自定义标签")}:` }}{{ index }}---{{ item.name }}</div>
        </template>
        <template #panel>
          <div>
            {{ `${t("自定义内容")}:` }}
            {{ item.label }}
          </div>
        </template>
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const active = ref('mission');
      const panels = ref([
        { name: 'mission', label: t('任务报表'), count: 10 },
        { name: 'config', label: t('加速配置'), count: 20 },
        { name: 'history', label: t('历史版本'), count: 30 },
        { name: 'deleted', label: t('已归档加速任务'), count: 40 },
      ]);

      return {
        active,
        panels,
        t,
      };
    },
    methods: {
      tabChange(name) {
        console.log(name);
      },
      changeActive(name) {
        this.active = name;
      },
      addPanel() {
        const name = Math.random().toString(16)
          .substring(4, 10);
        this.panels.push({
          name,
          label: `${this.t('新标签页')}-${name.substring(0, 4)}`,
          count: 50,
        });
        this.active = name;
      },
      removePanel(index, panel) {
        console.log(panel);
        this.panels.splice(index, 1);
      },
      tabSort(dragStartIndex, index) {
        console.log(dragStartIndex, index);
      },
      tabDrag(index, $event) {
        console.log(index, $event);
      },
    },
  });
</script>

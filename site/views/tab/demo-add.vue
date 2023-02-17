<template>
  <div>
    <bk-tab
      v-model:active="active"
      type="card"
      addable
      closable
      @add="addPanel"
      @remove="removePanel"
    >
      <bk-tab-panel
        v-for="(item,index) in panels"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    components: {},
    data() {
      const { t } = useI18n();
      return {
        panels: [
          { name: 'mission', label: t('任务报表'), count: 10 },
          { name: 'config', label: t('加速配置'), count: 20 },
          { name: 'history', label: t('历史版本'), count: 30 },
          { name: 'deleted', label: t('已归档加速任务'), count: 40 },
        ],
        active: 'mission',
        t,
      };
    },
    methods: {
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
    },
  });
</script>

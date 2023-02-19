<template>
  <div style="width: 100%; overflow: auto">
    <div class="row">
      <div class="column">
        <div class="attr-tag">
          {{ `node-content-action = ['selected', 'click', 'expand'] | (${t("默认配置")})` }}
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            children="children"
            :node-content-action="['selected', 'click', 'expand']"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          node-content-action =['selected', 'click']
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            :node-content-action="['selected', 'click']"
            children="children"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          {{ `node-content-action =[] | (${t("如果要禁用所有行为请设置为[],不要设置null|undefined之类，这类设置会被置换为默认配置")})` }}
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            :node-content-action="[]"
            children="children"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BASIC_DATA } from './options';

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const treeData = ref([...JSON.parse(JSON.stringify(BASIC_DATA))]);

      return {
        treeData,
        t,
      };
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
  padding-top: 15px;
}

.column {
  width: 33%;
}

.cell {
  height: 300px;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}

.attr-tag {
  padding: 10px;
  margin-right: 2px;
  background: #f0f1f5;
}
</style>

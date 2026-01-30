<template>
  <div style="width: 100%; overflow: auto">
    <bk-input
      style="width: 400px; margin-left: 20px"
      v-model="search.value"
      type="search"
    />
    <div class="row">
      <div class="column">
        <div class="attr-tag">node-content-action = ['selected', 'click', 'expand', 'collapse'] | (默认配置)</div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            :node-content-action="['selected', 'click', 'expand', 'collapse']"
            :search="search"
            children="children"
            label="name"
            expand-all
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">node-content-action =['selected', 'click']</div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            :node-content-action="['selected', 'click']"
            :search="search"
            children="children"
            label="name"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          node-content-action =[] |
          (如果要禁用所有行为请设置为[],不要设置null|undefined之类，这类设置会被置换为默认配置)
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            :node-content-action="[]"
            :search="search"
            children="children"
            label="name"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          node-content-action =['checked', 'expand', 'click'] + show-checkbox |
          点击节点内容切换复选框选中状态
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData2"
            :node-content-action="['checked', 'expand', 'click']"
            :search="search"
            :show-checkbox="true"
            children="children"
            label="name"
            expand-all
            @node-checked="handleNodeChecked"
          />
        </div>
        <div class="checked-info">
          已选中: {{ checkedNodes.map(n => n.name).join(', ') || '无' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { BASIC_DATA } from './options';

  // 深拷贝数据，避免两个树共享数据导致状态冲突
  const cloneData = data => JSON.parse(JSON.stringify(data));

  export default defineComponent({
    components: {},
    data() {
      return {
        treeData: BASIC_DATA,
        treeData2: cloneData(BASIC_DATA),
        search: {
          value: '',
          showChildNodes: true,
        },
        checkedNodes: [],
      };
    },
    methods: {
      handleNodeChecked(checkedList) {
        this.checkedNodes = checkedList;
      },
    },
  });
</script>
<style scoped>
  @import './tree.less';

  .attr-tag {
    padding: 10px;
    margin-right: 2px;
    background: #f0f1f5;
  }

  .checked-info {
    padding: 10px;
    margin-top: 10px;
    background: #e1ecff;
    border-radius: 4px;
    font-size: 12px;
    color: #3a84ff;
  }
</style>

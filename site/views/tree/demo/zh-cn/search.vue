<template>
  <div style="width: 100%; overflow: auto">
    <bk-input
      v-model="searchVal"
      placeholder="Search"
      type="search"
    />
    <div class="row">
      <div class="cell">
        <span>简化配置: <code>search = string</code></span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :search="searchVal"
        />
      </div>
      <div class="cell">
        <span>详细配置: <code>search = { SearchOption }</code></span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :search="searchOption1"
        />
      </div>
      <div class="cell">
        <span>详细配置-自定义搜索条件: <code>search = { SearchOption }</code></span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :search="searchOption2"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, ref } from 'vue';

  import { BASIC_DATA } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const searchVal = ref('');
      const treeData = ref([...BASIC_DATA]);

      const searchFn = (searchValue, itemValue, item) => {
        const match = searchValue === '' || searchValue === itemValue;
        console.log('search fn', searchValue, item, match);
        return match;
      };

      const searchOption1 = computed(() => ({
        /**
         * 需要匹配的值
         * 支持字符串
         * */
        value: searchVal.value,

        /**
         * 支持模糊匹配（fuzzy） || 完全匹配（full）
         * 默认 模糊匹配（fuzzy）
         * 支持自定义匹配函数 (searchValue, itemText, item) => true || false
         */
        match: 'fuzzy',

        /**
         * 显示为 tree || list
         * 默认 tree
         */
        resultType: 'tree',
      }));

      const searchOption2 = computed(() => ({
        /**
         * 需要匹配的值
         * */
        value: searchVal.value,

        /**
         * 支持模糊匹配（fuzzy） || 完全匹配（full）
         * 默认 模糊匹配（fuzzy）
         * 支持自定义匹配函数 (searchValue, itemText, item) => true || false
         */
        match: searchFn,

        /**
         * 显示为 tree || list
         * 默认 tree
         */
        resultType: 'tree',
      }));

      return {
        searchVal,
        treeData,
        searchOption1,
        searchOption2,
        searchFn,
      };
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
  height: 300px;
  padding-top: 15px;
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

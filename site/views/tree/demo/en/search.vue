<template>
  <div style="width: 100%; overflow: auto">
    <bk-input
      v-model="searchVal"
      placeholder="Search"
      type="search"
    />
    <div class="row">
      <div class="cell">
        <span>Simplify configuration: <code>search = string</code></span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :search="searchVal"
        />
      </div>
      <div class="cell">
        <span>Detailed configuration: <code>search = { SearchOption }</code></span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :search="searchOption1"
        />
      </div>
      <div class="cell">
        <span>Detailed Configuration - Custom Search Criteria: <code>search = { SearchOption }</code></span>
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
         * Value to match
         * Support string
         * */
        value: searchVal.value,

        /**
         * Support fuzzy matching | | full matching
         * Default fuzzy match
         * Support user-defined matching function (searchValue, itemText, item)=>true | | false
         */
        match: 'fuzzy',

        /**
         * Display as tree | | list
         * Default tree
         */
        resultType: 'tree',
      }));

      const searchOption2 = computed(() => ({
        /**
         * Value to match
         * */
        value: searchVal.value,

        /**
         * Support fuzzy matching | | full matching
         * Default fuzzy match
         * Support custom matching function (searchValue, itemText, item)=>true | | false
         */
        match: searchFn,

        /**
         * Display as tree | | list
         * Default tree
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

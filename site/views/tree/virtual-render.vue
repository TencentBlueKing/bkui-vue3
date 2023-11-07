<template>
  <div style="width: 100%;overflow: hidden;">
    <div style="padding: 15px 0;display: flex;">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        随机数据
      </bk-button>
      <bk-input v-model="search.value" style="width: 400px;margin-left: 20px;" type="search"></bk-input>
    </div>
    <div style="height: 400px;">
      <bk-tree
        :data="treeData"
        :height="400"
        :search="search"
        virtual-render
        show-checkbox
        level-line
        label="name"
        children="children"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { BASIC_DATA } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        treeData: [...BASIC_DATA],
        search: {
          value: '',
          showChildNodes: true
        }
      };
    },
    methods: {
      handleRandomRows() {
        this.treeData.length = 0;
        function randomChildren(depth = 5) {
          if (depth > 0) {
            const length = Math.ceil(Math.random() * depth);
            return new Array(length)
              .fill(depth)
              .map((item, index) => ({ name: `depth-${item}-${index}`, children: randomChildren(depth - 1) }));
          }

          return [];
        }
        this.treeData = randomChildren();
      },
    },
    mounted() {
      setTimeout(() => {
        this.handleRandomRows();
      }, 500);
    }
  });
</script>


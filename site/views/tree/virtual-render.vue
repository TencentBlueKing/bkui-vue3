<template>
  <div style="width: 100%;overflow: hidden;">
    <div style="display: flex;padding: 15px 0;">
      <bk-button
        theme="primary"
        @click="handleRandomRows"
      >
        随机数据
      </bk-button>
      <span style="padding: 4px;" />
      <bk-button
        theme="primary"
        @click="() => handleHeightChange(100)"
      >
        设置高度 +
      </bk-button>
      <span style="padding: 4px;" />
      <bk-button
        theme="primary"
        @click="() => handleHeightChange(-100)"
      >
        设置高度 -
      </bk-button>
      <span style="padding: 4px;" />
      <bk-button
        theme="primary"
        @click="handleScrollToTop"
      >
        ScrollToTop({{ scrollToPath }})
      </bk-button>
      <bk-input
        v-model="search.value"
        style="width: 400px;margin-left: 20px;"
        type="search"
      />
    </div>
    <div :style="{ height: `${height}px` }">
      <bk-tree
        ref="refTree"
        expand-all
        :data="treeData"
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
        height: 500,
        scrollToPath: '-',
        search: {
          value: '',
          showChildNodes: true,
        },
      };
    },
    mounted() {
      setTimeout(() => {
        this.handleRandomRows();
      }, 500);
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
      handleHeightChange(value) {
        this.height = this.height + value;
        this.$refs.refTree.reset();
      },
      handleScrollToTop() {
        const data = this.$refs.refTree.getData();
        const targetItem = data.data[Math.ceil(data.data.length / 2)];
        this.scrollToPath = targetItem.name;
        this.$refs.refTree.scrollToTop(targetItem);
      },
    },
  });
</script>


<template>
  <div class="row">
    <div class="column">
      <div>
        <bk-button
          theme="primary"
          :loading="generating"
          @click="handleCreateMillionNodes"
        >
          生成 100 万节点 (depth≤4)
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="primary"
          :disabled="generating"
          @click="handleRandomRows"
        >
          随机小数据
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="primary"
          @click="() => handleHeightChange(100)"
        >
          设置高度 +
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="primary"
          @click="() => handleHeightChange(-100)"
        >
          设置高度 -
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="primary"
          @click="handleScrollToTop"
        >
          ScrollToTop({{ scrollToPath }})
        </bk-button>
        <bk-input
          style="width: 400px; margin-left: 20px"
          v-model="search.value"
          type="search"
        />
        <span style="margin-left: 12px; color: #63656e">
          节点数: {{ nodeCount.toLocaleString() }} {{ genCostText }}
        </span>
      </div>
      <div
        :style="{ height: `${height}px` }"
        class="cell"
      >
        <bk-tree
          ref="refTree"
          :data="treeData"
          :search="search"
          children="children"
          label="name"
          node-key="id"
          level-line
          show-checkbox
          virtual-render
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, markRaw, shallowRef } from 'vue';

  import { BASIC_DATA } from './options';

  const TARGET_TOTAL = 1_000_000;
  const MAX_DEPTH = 4;

  /**
   * 生成指定总量、最大深度的树数据。
   * 节点按 4^depth 权重分配到各层，叶子层最多。
   */
  function createLargeTree(totalNodes = TARGET_TOTAL, maxDepth = MAX_DEPTH) {
    const ratios = Array.from({ length: maxDepth + 1 }, (_, depth) => 4 ** depth);
    const ratioSum = ratios.reduce((sum, item) => sum + item, 0);
    const levelSize = ratios.map(ratio => Math.max(1, Math.floor((totalNodes * ratio) / ratioSum)));
    levelSize[maxDepth] += totalNodes - levelSize.reduce((sum, item) => sum + item, 0);

    let id = 0;
    const makeNode = depth => ({
      id: id++,
      name: `d${depth}-${id - 1}`,
      children: [],
    });

    let prevLevel = Array.from({ length: levelSize[0] }, () => makeNode(0));
    const roots = prevLevel;

    for (let depth = 1; depth <= maxDepth; depth++) {
      const count = levelSize[depth];
      const parentCount = prevLevel.length;
      const base = Math.floor(count / parentCount);
      let extra = count % parentCount;
      const currLevel = [];

      for (let parentIndex = 0; parentIndex < parentCount; parentIndex++) {
        const childCount = base + (extra > 0 ? 1 : 0);
        if (extra > 0) {
          extra -= 1;
        }
        for (let i = 0; i < childCount; i++) {
          const child = makeNode(depth);
          prevLevel[parentIndex].children.push(child);
          currLevel.push(child);
        }
      }
      prevLevel = currLevel;
    }

    return { roots, count: id, levelSize };
  }

  export default defineComponent({
    components: {},
    setup() {
      // shallowRef + markRaw：避免 Vue 对百万节点做深响应式代理
      const treeData = shallowRef(markRaw([...BASIC_DATA]));
      const setTreeData = next => {
        treeData.value = markRaw(next);
      };
      return { treeData, setTreeData };
    },
    data() {
      return {
        height: 500,
        scrollToPath: '-',
        nodeCount: BASIC_DATA.length,
        generating: false,
        genCostText: '',
        search: {
          value: '',
          showChildNodes: true,
        },
      };
    },
    methods: {
      handleCreateMillionNodes() {
        if (this.generating) {
          return;
        }
        this.generating = true;
        this.genCostText = '（生成中…）';
        // 让 loading 先上屏，再同步构建大数据
        requestAnimationFrame(() => {
          const genStart = performance.now();
          const { roots, count, levelSize } = createLargeTree(TARGET_TOTAL, MAX_DEPTH);
          const genCost = Math.round(performance.now() - genStart);

          // 通过 setTreeData 写 shallowRef.value，避免 Options API 赋值覆盖 ref
          const parseStart = performance.now();
          this.setTreeData(roots);
          this.$nextTick(() => {
            const parseCost = Math.round(performance.now() - parseStart);
            this.nodeCount = count;
            this.genCostText = `（生成 ${genCost}ms / Tree解析约 ${parseCost}ms，分层 ${levelSize.join('/')}）`;
            this.generating = false;
            console.info('[tree virtual-render] large data ready', { count, levelSize, genCost, parseCost });
          });
        });
      },
      handleRandomRows() {
        this.genCostText = '';
        function randomChildren(depth = 5) {
          if (depth > 0) {
            const length = Math.ceil(Math.random() * depth);
            return new Array(length).fill(depth).map((item, index) => ({
              id: `r-${depth}-${index}-${Math.random().toString(36).slice(2, 8)}`,
              name: `depth-${item}-${index}`,
              children: randomChildren(depth - 1),
            }));
          }
          return [];
        }
        const next = randomChildren();
        this.setTreeData(next);
        this.nodeCount = this.countNodes(next);
      },
      countNodes(nodes) {
        let total = 0;
        const walk = list => {
          (list || []).forEach(node => {
            total += 1;
            walk(node.children);
          });
        };
        walk(nodes);
        return total;
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

<style scoped>
  @import './tree.less';
</style>

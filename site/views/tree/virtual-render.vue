<template>
  <div class="row">
    <div class="column">
      <div class="toolbar">
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
          高度 +
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="primary"
          @click="() => handleHeightChange(-100)"
        >
          高度 -
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          theme="warning"
          @click="handleCollapseAll"
        >
          collapseAll
        </bk-button>
        <span style="padding: 4px" />
        <bk-button
          :theme="reproMode ? 'danger' : 'primary'"
          @click="reproMode = !reproMode"
        >
          {{ reproMode ? '复现模式:开' : '复现模式:关' }}
        </bk-button>
        <bk-input
          style="width: 280px; margin-left: 12px"
          v-model="searchValue"
          type="search"
          placeholder="搜索节点名"
          clearable
        />
        <span class="meta">
          节点数: {{ nodeCount.toLocaleString() }}
          {{ genCostText }}
          {{ actionCostText }}
          | 选中: {{ selectedLabel }}
          | 对比列表: {{ compareHostList.length.toLocaleString() }}
        </span>
      </div>

      <div class="hint">
        <template v-if="reproMode">
          复现 host-topo-tree：#node 内 countDescendants（扫子树）+ selected=[id] 数组 +
          node-click 更新选中触发全树 collectCompareList。对比：点内容 vs 点展开箭头，看 clickCost。
        </template>
        <template v-else>
          优化对照：读预计算 hostCount、selected 传 id、选中不扫全树。
        </template>
      </div>

      <div
        :style="{ height: `${height}px` }"
        class="cell"
      >
        <!-- 与 host-topo-tree 对齐的配置 -->
        <bk-tree
          ref="refTree"
          :data="treeData"
          :search="treeSearch"
          :selected="treeSelected"
          :node-content-action="nodeContentAction"
          :prefix-icon="getPrefixIcon"
          :level-line="levelLine"
          children="children"
          label="name"
          node-key="id"
          :show-node-type-icon="false"
          virtual-render
          @node-click="handleNodeClick"
        >
          <template #node="item">
            <div class="topo-node">
              <span class="topo-node__label">{{ item.name }}</span>
              <span
                v-if="item.children?.length"
                class="topo-node__count"
              >
                {{ reproMode ? countDescendants(item) : item.hostCount ?? 0 }}
              </span>
            </div>
          </template>
        </bk-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent, markRaw, shallowRef } from 'vue';

  import { BASIC_DATA } from './options';

  const TARGET_TOTAL = 1_000_000;
  const MAX_DEPTH = 4;

  /** 同 host-topo countHostNodes：渲染期扫子树（复现卡顿用） */
  function countDescendants(node) {
    const children = node.children || [];
    if (!children.length) {
      return 0;
    }
    let total = 0;
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i];
      total += 1 + countDescendants(child);
    }
    return total;
  }

  /** 同 host-topo compareHostList：选中变更时扫整棵树 */
  function collectCompareList(roots, excludeId) {
    const map = new Map();
    const walk = list => {
      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        if (item.id !== excludeId && !map.has(item.id)) {
          map.set(item.id, item);
        }
        if (item.children?.length) {
          walk(item.children);
        }
      }
    };
    walk(roots || []);
    return Array.from(map.values());
  }

  /** 生成数据时预计算 hostCount（优化对照） */
  function attachHostCount(nodes) {
    return (nodes || []).map(node => {
      const children = attachHostCount(node.children || []);
      const hostCount = children.reduce((sum, child) => sum + 1 + (child.hostCount || 0), 0);
      return { ...node, children, hostCount };
    });
  }

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

    return { roots: attachHostCount(roots), count: id, levelSize };
  }

  export default defineComponent({
    components: {},
    setup() {
      // shallowRef + markRaw：避免 Vue 对百万节点做深响应式代理
      const treeData = shallowRef(markRaw(attachHostCount([...BASIC_DATA])));
      const setTreeData = next => {
        treeData.value = markRaw(next);
      };

      const searchValue = shallowRef('');
      const selectedNode = shallowRef(null);
      /** 复现模式默认开：对齐线上 host-topo-tree 慢路径 */
      const reproMode = shallowRef(true);

      // 点击内容：选中 + 展开 + click；不含 collapse（同 host-topo-tree）
      const nodeContentAction = ['selected', 'expand', 'click'];
      const levelLine = '1px solid #EBEEF5';

      /** 保留展开箭头、去掉节点类型图标（同 getPrefixIcon） */
      const getPrefixIcon = (_item, renderType) => (renderType === 'node_action' ? 'default' : null);

      /**
       * 复现：每次渲染新建 search 对象 + selected 数组（同线上）
       * 对照：稳定 id / 稳定 search 结构
       */
      const treeSearch = computed(() => ({
        value: searchValue.value,
        showChildNodes: true,
      }));

      const treeSelected = computed(() => {
        const id = selectedNode.value?.id;
        if (id === undefined || id === null) {
          return undefined;
        }
        // 线上：selectedIds = [id]，每次新数组
        return reproMode.value ? [id] : id;
      });

      /**
       * 复现：依赖 selectedNode，每次点选扫全树（同 compareHostList）
       * 对照：不随选中重建（空依赖展示长度即可）
       */
      const compareHostList = computed(() => {
        if (!reproMode.value) {
          return [];
        }
        return collectCompareList(treeData.value, selectedNode.value?.id);
      });

      const selectedLabel = computed(() => selectedNode.value?.name ?? '-');

      return {
        treeData,
        setTreeData,
        searchValue,
        selectedNode,
        reproMode,
        nodeContentAction,
        levelLine,
        getPrefixIcon,
        treeSearch,
        treeSelected,
        compareHostList,
        selectedLabel,
        countDescendants,
      };
    },
    data() {
      return {
        height: 560,
        nodeCount: BASIC_DATA.length,
        generating: false,
        genCostText: '',
        actionCostText: '',
      };
    },
    methods: {
      handleNodeClick(node) {
        const start = performance.now();
        // 同 host-topo：ctx.handleSelectNode(node)
        this.selectedNode = node;
        // 强制读一次 compareHostList，模拟 host.tsx 下传对比列表
        const listLen = this.compareHostList.length;
        this.$nextTick(() => {
          const cost = Math.round(performance.now() - start);
          this.actionCostText = `（content click ${cost}ms, compareList=${listLen.toLocaleString()}）`;
          console.info('[tree virtual-render] content click', { cost, listLen, reproMode: this.reproMode });
        });
      },
      handleCreateMillionNodes() {
        if (this.generating) {
          return;
        }
        this.generating = true;
        this.genCostText = '（生成中…）';
        this.actionCostText = '';
        this.selectedNode = null;
        requestAnimationFrame(() => {
          const genStart = performance.now();
          const { roots, count, levelSize } = createLargeTree(TARGET_TOTAL, MAX_DEPTH);
          const genCost = Math.round(performance.now() - genStart);

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
        this.actionCostText = '';
        this.selectedNode = null;
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
        const next = attachHostCount(randomChildren());
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
      handleCollapseAll() {
        const tree = this.$refs.refTree;
        if (!tree?.collapseAll) {
          return;
        }
        const start = performance.now();
        tree.collapseAll();
        this.$nextTick(() => {
          const cost = Math.round(performance.now() - start);
          this.actionCostText = `（collapseAll ${cost}ms）`;
        });
      },
    },
  });
</script>

<style scoped>
  @import './tree.less';

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 0;
    margin-bottom: 8px;
  }

  .meta {
    margin-left: 12px;
    color: #63656e;
    font-size: 12px;
  }

  .hint {
    margin-bottom: 8px;
    padding: 8px 12px;
    color: #63656e;
    font-size: 12px;
    line-height: 1.5;
    background: #f0f1f5;
    border-radius: 2px;
  }

  .topo-node {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .topo-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topo-node__count {
    flex-shrink: 0;
    color: #979ba5;
    font-size: 12px;
  }
</style>

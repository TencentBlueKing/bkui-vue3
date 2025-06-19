<template>
  <div class="cascader-wrapper">
    <bk-cascader
      v-model="area"
      :list="list"
      behavior="simplicity"
      trigger="click"
    >
      <template #extension>
        <div class="custom-extension">
          <div v-if="showEdit" class="edit-mode">
            <bk-input
              ref="inputRef"
              v-model="newNodeName"
              size="small"
              placeholder="如: 广东/深圳/南山"
              @enter="addNode"
            />
            <div class="action-buttons">
              <done
                class="action-icon done"
                @click="addNode"
              />
              <error
                class="action-icon close"
                @click="showEdit = false"
              />
            </div>
          </div>
          <div v-else class="view-mode">
            <span
              class="add-node"
              @click="handleShowEdit"
            >
              <plus class="icon-plus" />
              新增节点
            </span>
            <span class="divider-wrapper">
              <bk-divider direction="vertical" type="solid" />
              <spinner
                v-if="isLoading"
                class="icon-loading"
              />
              <right-turn-line
                v-else
                class="icon-refresh"
                @click="refresh"
              />
            </span>
          </div>
        </div>
      </template>
    </bk-cascader>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Done, Error, Plus, RightTurnLine, Spinner } from '@bkui-vue/icon';

const list = ref([
  {
    id: 'hunan',
    name: '湖南',
    disabled: true,
    children: [
      {
        id: 'changsha',
        name: '长沙',
      },
      {
        id: 'yueyang',
        name: '岳阳',
        disabled: true,
      },
    ],
  },
  {
    id: 'guangxi',
    name: '广西',
  },
  {
    id: 'yunnan',
    name: '云南',
    children: [
      {
        id: 'kunming',
        name: '昆明',
        children: [
          {
            id: 'wuhuaqu',
            name: '五华区',
          },
          {
            id: 'guanduqu',
            name: '官渡区',
          },
          {
            id: 'xishanqu',
            name: '西山区',
          },
        ],
      },
      {
        id: 'dali',
        name: '大理',
      },
      {
        id: 'yuxi',
        name: '玉溪',
      },
    ],
  },
]);

const area = ref([]);
const showEdit = ref(false);
const newNodeName = ref('');
const isLoading = ref(false);

const handleShowEdit = () => {
  showEdit.value = true;
};

// 根据路径查找父节点
const findParentNode = (path) => {
  const parts = path.split('/');
  if (parts.length === 1) return { parent: list.value, index: -1 };

  let current = list.value;
  let parent = null;
  let targetName = parts[parts.length - 2]; // 父节点的名称

  for (let i = 0; i < parts.length - 1; i++) {
    const name = parts[i];
    parent = current;
    const found = current.find(item => item.name === name);
    if (!found) return null;
    if (!found.children) found.children = [];
    current = found.children;
  }

  const parentNode = parent.find(item => item.name === targetName);
  if (!parentNode.children) parentNode.children = [];
  return { parent: parentNode.children, index: -1 };
};

// 添加节点
const addNode = () => {
  if (!newNodeName.value) return;
  
  const path = newNodeName.value;
  const parts = path.split('/');
  const nodeName = parts[parts.length - 1];
  
  // 生成唯一 ID
  const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newNode = {
    id: nodeId,
    name: nodeName,
  };

  if (parts.length === 1) {
    // 添加到根级别
    list.value.push(newNode);
  } else {
    // 添加到指定路径
    const target = findParentNode(path);
    if (target) {
      target.parent.push(newNode);
    } else {
      // 如果找不到父节点，创建完整的路径
      let current = list.value;
      for (let i = 0; i < parts.length - 1; i++) {
        const name = parts[i];
        let node = current.find(item => item.name === name);
        if (!node) {
          node = {
            id: `node-${Date.now()}-${i}`,
            name: name,
            children: [],
          };
          current.push(node);
        }
        if (!node.children) node.children = [];
        current = node.children;
      }
      current.push(newNode);
    }
  }
  
  newNodeName.value = '';
  showEdit.value = false;
};

const refresh = async () => {
  isLoading.value = true;
  // 模拟刷新操作
  await new Promise(resolve => setTimeout(resolve, 1000));
  isLoading.value = false;
};
</script>

<style lang="less" scoped>
.cascader-wrapper {
  width: 250px;
}

.custom-extension {
  padding: 8px 12px;
  border-top: 1px solid #dcdee4;

  .edit-mode {
    display: flex;
    align-items: center;

    .action-buttons {
      display: flex;
      align-items: center;
      margin-left: 6px;

      .action-icon {
        cursor: pointer;

        &.done {
          font-size: 22px;
          color: #2dcb56;
        }

        &.close {
          margin-left: 2px;
          font-size: 16px;
          color: #c4c6cc;
        }
      }
    }
  }

  .view-mode {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .add-node {
      display: flex;
      align-items: center;
      color: #63656e;
      cursor: pointer;

      .icon-plus {
        margin-right: 4px;
        font-size: 20px;
      }

      &:hover {
        color: #3a84ff;
      }
    }

    .divider-wrapper {
      display: flex;
      align-items: center;

      .icon-loading {
        margin-left: 8px;
        font-size: 14px;
        color: #3a84ff;
      }

      .icon-refresh {
        margin-left: 8px;
        font-size: 14px;
        color: #63656e;
        cursor: pointer;

        &:hover {
          color: #3a84ff;
        }
      }
    }
  }
}
</style>

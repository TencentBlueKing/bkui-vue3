<template>
  <section
    class="table-component"
    :id="id"
  >
    <h2>{{ componentKey }} {{ categoryKey }}</h2>
    <p
      class="type-desc"
      v-if="categoryKeyDesc"
    >
      {{ categoryKeyDesc }}
    </p>
    <table class="base-table">
      <!-- 表头 -->
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width || 'auto' }"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>

      <!-- 表格内容 -->
      <tbody>
        <tr
          v-for="row in computedTableData"
          :key="row.name"
        >
          <td
            v-for="column in columns"
            :key="column.key"
          >
            <component :is="row[column.key]" />
          </td>
        </tr>
        <tr v-if="tableData.length === 0">
          <td
            :colspan="columns.length"
            class="no-data"
          >
            暂无数据
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, h, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useStorage from '@/hooks/use-storage';
import { useComponent } from '@/store/component';
import { Column, IComponentWiki, IParam, PropItem } from '@/types/component';
import { ANCHOR_KEY } from '@/types/contants';

const iProps = defineProps<IProps>();
const route = useRoute();
const router = useRouter();
const componentStore = useComponent();

// 列类型枚举
enum EColumnTypeEnum {
  name = '名称',
  description = '说明',
  type = '类型',
  params = '参数',
  default = '默认值',
}

type EColumnType = keyof typeof EColumnTypeEnum;

interface IProps {
  tableData: IComponentWiki['props' | 'emits' | 'slots'];
  categoryKey: string;
  activeComponent: IComponentWiki | null;
  componentKey?: string;
  categoryKeyDesc?: string;
  id?: string;
}

// 存储方法
const { setStorage, removeStorage, getStorage } = useStorage();

// 表格列配置
const columns = computed(() => {
  // 列配置
  const cols: Column[] = [];
  // 列key
  const keys: EColumnType[] = [];
  iProps.tableData.forEach((item) => {
    keys.push(...(Object.keys(item) as EColumnType[]));
  });
  const keySet = new Set(keys);
  // 按照EColumnTypeEnum的顺序排序
  const orderedKeys = Object.keys(EColumnTypeEnum) as EColumnType[];
  orderedKeys.forEach((key) => {
    if (keySet.has(key)) {
      cols.push({
        key,
        title: EColumnTypeEnum[key],
      });
    }
  });

  return cols.filter(f => f.title);
});

/**
   * @description 渲染枚举类型
   * @param text 类型值
   * @param linkMap 链接映射
   */
const renderEnumWithLinks = (text: string, linkMap: Record<string, string>) => {
  // 分割文本为各个部分
  const parts = text.split(/(\s+\|\s+)/);

  return parts.map((part) => {
    // 如果是枚举类型（存在于 linkMap 中）
    if (linkMap[part.trim()]) {
      return h(
        'span',
        {
          class: 'table-link',
          onClick: () => {
            setStorage(ANCHOR_KEY, linkMap[part.trim()].split('#')[1]);
            router.push({
              ...router.currentRoute.value,
              query: {
                ...router.currentRoute.value.query,
                version: componentStore.version,
              },
              hash: getStorage(ANCHOR_KEY) ? `#${getStorage(ANCHOR_KEY)}` : '',
            });
            window.open(route.fullPath);
          },
          style: { cursor: 'pointer' },
        },
        part,
      );
    }
    // 如果是分隔符或其他文本直接返回
    return part;
  });
};

onMounted(() => {
  // version 的存储和读取统一由 render-nav 处理，此处不再操作
  // 滚动到锚点
  setTimeout(() => {
    const element = document.getElementById(getStorage(ANCHOR_KEY));
    element?.scrollIntoView({
      behavior: 'smooth', // 平滑滚动
      block: 'start', // 垂直对齐方式 (start/center/end/nearest)
    });
  }, 2000);
});

onUnmounted(() => {
  removeStorage(ANCHOR_KEY);
});

/**
   * @description 渲染链接
   * @param row 类型参数
   */
const renderLink = (row: PropItem | IParam) => {
  if (!row.link) {
    return h('span', row.type);
  }

  if (typeof row.link === 'string') {
    const match = row.link.match(/#(.*)$/);
    const link = {
      [match[1]]: row.link,
    };
    return h('span', renderEnumWithLinks((row as PropItem).options?.join(' | ') ?? row.type, link));
  }
  return h('span', renderEnumWithLinks((row as PropItem).options?.join(' | ') ?? row.type, row.link));
};

/**
   * @description 渲染普通文本
   * @param text 文本值
   */
const renderText = (text: string) => {
  return h('span', text);
};

/**
   * @description 渲染tag样式
   * @param text 文本值
   */
const renderTag = (text: string) => {
  return h(
    'span',
    {
      class: 'default-tag',
    },
    text,
  );
};

/**
   * @description 渲染参数部分
   * @param params 参数列表
   */
const renderFunctionSignature = (params: IParam[]) => {
  const paramElements = params
    .map((param, index) => {
      const elements = [
        h('span', { class: 'param-name' }, param.name),
        h('span', ': '),
        h('span', { class: 'param-type' }, param.link ? renderLink(param) : param.type),
      ];
        // 如果不是最后一个参数，添加逗号和空格
      if (index < params.length - 1) {
        elements.push(h('span', ', '));
      }
      return elements;
    })
    .flat();

  // 组合完整签名
  return h('div', { class: 'function-signature' }, [
    h('span', '('),
    ...paramElements,
    h('span', ')'),
    h('span', ' => '),
    h('span', { class: 'return-type' }, 'void'),
  ]);
};

// 处理表格数据，为每个单元格生成对应的渲染组件
const computedTableData = computed(() => {
  return iProps.tableData.map((item) => {
    const processedRow = { ...item };

    // 为每个列生成对应的渲染组件
    columns.value.forEach((column) => {
      const value = item[column.key];

      // 定义渲染策略映射
      const renderStrategies = {
        type: () => ((item as PropItem).link ? renderLink(item as PropItem) : renderText(value)),
        default: () => {
          if (value === undefined) {
            return renderText('--');
          }
          if (typeof value === 'number' || !isNaN(value)) {
            return renderText(value);
          }
          return renderTag(value);
        },
        params: () => {
          return renderFunctionSignature(value);
        },
      };

      // 根据列类型选择渲染策略，默认使用文本渲染
      const renderStrategy = renderStrategies[column.key] || (() => renderText(value));
      processedRow[column.key] = renderStrategy();
    });

    return processedRow;
  });
});
</script>

<style scoped lang="postcss">
  .table-component {
    margin-bottom: 40px;
  }

  .table-component h2 {
    font-weight: 600;
    font-size: 20px;
    color: #313238;
    letter-spacing: 0;
    line-height: 28px;
  }

  .type-desc {
    font-size: 14px;
    color: #313238;
    letter-spacing: 0;
    line-height: 30px;
    margin-top: 8px;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  .base-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-top: 12px;
  }

  .base-table thead {
    font-weight: 700;
    color: #313238;
  }

  .base-table thead th {
    min-height: 42px;
    background: #fafbfd;
    padding: 10px 14px 12px;
  }

  .base-table tr {
    border: 1px solid #dcdee5;
    text-align: left;
  }

  .base-table tbody td {
    min-height: 40px;
    background: #ffffff;
    padding: 10px 14px;
    color: #4d4f56;
  }

  .base-table tr:hover td {
    background-color: #f5f7fa;
  }

  .no-data {
    text-align: center;
    padding: 40px 0;
  }

  .table-link {
    color: #3a84ff;
    text-decoration: none;
    cursor: pointer;
  }

  .table-link:hover {
    color: #699df4;
  }

  .default-tag {
    display: inline-block;
    padding: 2px 8px;
    background: #f0f1f5;
    border-radius: 2px;
    color: #313238;
  }
</style>

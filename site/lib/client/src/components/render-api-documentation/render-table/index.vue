<template>
  <section
    class="table-component"
    :id="id"
  >
    <h2 @click="handleTitleClick">
      <span @click="handleCopyClick">#</span>
      {{componentKey ? `${componentKey} ` : ''}}{{ categoryKey }}
    </h2>
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
            <component :is="row[column.key as keyof IProp]" />
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

import { copyToClipboard } from '@/common/util';
import useStorage from '@/hooks/use-storage';
import { useComponent } from '@/store/component';
import { Column, IComponentWiki, IParam, IProp } from '@/types/component';
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
  tableData: IProp[];
  // 组件key对应分类（例如：事件、方法等）
  categoryKey: string;
  activeComponent: IComponentWiki | null;
  // 组件key（例如：组件类型名Affix等）
  componentKey?: string;
  // 组件key对应类型描述
  categoryKeyDesc?: string;
  // 锚点
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
  // 分割文本为各个部分(包含分隔符)
  const parts = text.split(/([|{}[\]<>,;"'\s])/);

  return parts.map((part) => {
    // 如果是枚举类型（存在于 linkMap 中）
    if (linkMap[part.trim()]) {
      return h(
        'span',
        {
          class: 'table-link',
          onClick: () => {
            // 如果是外部链接，直接打开
            const isOtherSite = /^https?:\/\//.test(linkMap[part.trim()]);
            if (isOtherSite) {
              window.open(linkMap[part.trim()]);
              return;
            }
            // 组件内部链接情况
            setStorage(ANCHOR_KEY, linkMap[part.trim()].split('#')[1]);
            router.push({
              ...router.currentRoute.value,
              query: {
                ...router.currentRoute.value.query,
                version: componentStore.version,
              },
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
 * @description 渲染v-model标签
 */
const renderVModelTag = () => {
  return h('span', { class: 'default-tag' }, 'v-model');
};

/**
   * @description 渲染链接
   * @param row 类型参数
   */
const renderLink = (row: IProp | IParam) => {
  if (!row.link) {
    return h('span', row.type);
  }

  if (typeof row.link === 'string') {
    const match = row.link.match(/#(.*)$/);
    const link = {
      [match[1]]: row.link,
    };
    return h('span', renderEnumWithLinks((row as IProp).options?.join(' | ') ?? row.type, link));
  }
  return h('span', renderEnumWithLinks((row as IProp).options?.join(' | ') ?? row.type, row.link));
};

/**
   * @description 渲染普通文本
   * @param text 文本值
   */
const renderText = (text: string, row?: IProp) => {
  if (!row?.isSupportVModel) {
    return h('span', text);
  }
  // 如果支持v-model，添加v-model标签提示
  return h('span', [
    h('span', text),
    renderVModelTag(),
  ]);
};

/**
   * @description 渲染参数部分
   * @param params 参数列表
   */
const renderFunctionSignature = (params: IParam[]) => {
  if (!params) {
    return h('span', '--');
  }
  const paramElements = params
    ?.map((param, index) => {
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
    ...(paramElements || []),
    h('span', ')'),
    h('span', ' => '),
    h('span', { class: 'return-type' }, 'void'),
  ]);
};

// 处理表格数据，为每个单元格生成对应的渲染组件
const computedTableData = computed(() => {
  return iProps.tableData.map((item) => {
    const processedRow: Record<string, any> = { ...item };

    // 为每个列生成对应的渲染组件
    columns.value.forEach((column) => {
      const value = item[column.key as keyof IProp];

      // 定义渲染策略映射
      const renderStrategies = {
        name: () => renderText(value as string, item),
        type: () => (item.link ? renderLink(item) : renderText(item.options?.join(' | ') ?? value as string)),
        default: () => {
          if (value === undefined || value === '') {
            return renderText('--');
          }
          return renderText(value as string);
        },
        params: () => {
          return renderFunctionSignature(value as IParam[]);
        },
      };

      // 根据列类型选择渲染策略，默认使用文本渲染
      const renderStrategy = renderStrategies[column.key as 'name' | 'type' | 'default'  | 'params'] || (() => renderText(value as string));
      processedRow[column.key as keyof IProp] = renderStrategy();
    });

    return processedRow;
  });
});

/**
 * @description 处理复制点击
 * @param e 鼠标事件
 */
const handleCopyClick = (e: MouseEvent) => {
  e.stopPropagation();
  // 复制URL地址到剪贴板
  copyToClipboard(window.location.href, '复制URL地址成功！');
};

/**
   * @description 处理标题点击
   */
const handleTitleClick = () => {
  if (!iProps.id) return;

  // 设置存储的锚点信息，让侧边栏能够识别
  setStorage(ANCHOR_KEY, iProps.id);

  // 更新路由hash，让地址栏显示锚点
  router.push({
    ...router.currentRoute.value,
    hash: `#${iProps.id}`,
    query: {
      ...router.currentRoute.value.query,
      version: componentStore.version,
    },
  });

  // 平滑滚动到对应位置
  const element = document.getElementById(iProps.id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
</script>

<style scoped lang="postcss">
  .table-component {
    margin-bottom: 40px;
  }

  .table-component h2 {
    position: relative;
    font-weight: 600;
    font-size: 20px;
    color: #313238;
    letter-spacing: 0;
    line-height: 28px;
    cursor: pointer;
    margin-left: -16px;

    span {
      opacity: 0;
      color: #3a84ff;
    }

    &:hover {
      span {
        opacity: 1;
      }
    }
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
    min-width: 65px;
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
    margin-left: 4px;
    padding: 2px 4px;
    background: #f0f5ff;
    border-radius: 2px;
    color: #313238;
    font-size: 10px;
  }
</style>

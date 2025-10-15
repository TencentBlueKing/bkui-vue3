<template>
  <div class="code-container">
    <div class="code-header">
      <div
        v-for="item in supportLanguages"
        :key="item.value"
        class="language-items"
        :class="[
          activeLanguage === item.value && 'active-language-item',
          item.disabled && 'disabled-language-item',
        ]"
        @click="toggleLanguage(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="code-content">
      <pre>
<code v-html="filterXss(highlightFactory(template(), 'xml'))"></code>
<code v-html="filterXss(highlightFactory(scriptStart, 'xml'))"></code>
<code v-html="filterXss(curScript)"></code>
<code v-html="filterXss(highlightFactory(scriptEnd, 'xml'))"></code>
      </pre>
    </div>
    <div class="code-footer">
      <bk-button
        class="copy-button"
        theme="primary"
        @click="handleCopyCode"
      >
        复制
      </bk-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  filterXss,
} from '@blueking/xss-filter';
import {
  Button as bkButton,
  Message,
} from 'bkui-vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import {
  computed,
  onBeforeMount,
  ref,
  toRefs,
} from 'vue';

import type {
  IComponentWiki,
  PropValue,
} from '@/types/component';

import {
  useClipboard,
} from '@vueuse/core';

import 'highlight.js/styles/atom-one-dark.css'; // 代码块高亮样式

type Languages = 'javascript' | 'typescript';
interface IProps {
  componentWiki: IComponentWiki;
  renderProps: Record<string, PropValue>;
  renderSlots: Record<string, string>;
}
interface LanguageItem<T = Languages> {
  name: string;
  value: T;
  disabled: boolean;
}
const props = defineProps<IProps>();

const { copy } = useClipboard({
  legacy: true, // 使用 execCommand 作为后备处理副本
});

const activeLanguage = ref<Languages>('typescript');
const supportLanguages = ref<LanguageItem[]>([
  {
    name: 'JavaScript',
    value: 'javascript',
    disabled: false,
  },
  {
    name: 'TypeScript',
    value: 'typescript',
    disabled: false,
  },
]);

const {
  componentWiki,
  renderProps,
  renderSlots,
} = toRefs(props);

// script标签开始
const scriptStart = computed(() => {
  const lang = activeLanguage.value === 'typescript' ? ' lang="ts"' : '';
  return `${BREAK_LINE}<script${lang} setup>`;
});
// script标签内容
const curScript = computed(() => {
  return highlightFactory(scriptContent(), activeLanguage.value);
});
// 换行符
const BREAK_LINE = '\n';
// 最小缩进单位
const INDENT = '  ';
// script标签结束
// eslint-disable-next-line no-useless-escape
const scriptEnd = '<\/script>';

// template 缩进处理
const indent = (num = 1) => new Array(num)
  .fill(INDENT)
  .join('');

const camelKey = (key: string) => key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// 创建标签
const createLabel = (
  name: string,
  slot: string,
  prefix = '',
  props: Record<string, PropValue> = {},
  currentIndent = 1,
  endLabelName = '',
) => {
  const slotPrefix = `${BREAK_LINE}${indent(currentIndent)}`;
  // 分隔符数
  const endIndentNum = currentIndent === 0 ? 0 : currentIndent - 1;
  const slotSuffix = `${BREAK_LINE}${indent(endIndentNum)}`;
  const propsPrefix = `${BREAK_LINE}${indent(endIndentNum + 1)}`;
  // 属性列表处理
  const propsList = Object.keys(props).map((key) => {
    return `${propsPrefix}:${key}="${camelKey(key)}"`;
  });
  const propsNum = propsList.length;
  propsNum > 0 && propsList.push(slotSuffix);
  // slot处理
  const curSlot = slot ? `${slotPrefix}${slot}${slotSuffix}` : '';
  const curEndLabelName = endLabelName || name;
  return `<${prefix}${name}${propsList.join('')}>${curSlot}</${prefix}${curEndLabelName}>`;
};

// slot生成
const createSlots = (indentNum: number) => {
  const splitIndentNum = indentNum ? indentNum - 1 : indentNum;
  const split = `${BREAK_LINE}${indent(splitIndentNum)}`;
  return Object.entries(renderSlots.value).map(([key, value]) => {
    const curSlotName = key === 'default' ? '' : ` #${key}`;
    const name = `template${curSlotName}`;
    let content = value;
    // 处理slot中的换行符，优化缩进
    if (value[0] === BREAK_LINE) {
      content = value
        .split(BREAK_LINE)
        .map(item => item.slice(2, item.length))
        .join(BREAK_LINE)
        .trim();
    }
    return createLabel(name, content, '', {}, indentNum, 'template');
  })
    .join(split);
};

// template生成
const template = () => {
  return createLabel(
    'template',
    createLabel(
      componentWiki.value.name,
      createSlots(3),
      'bk-',
      renderProps.value,
      2,
    ),
  );
};

// 生成依赖导入
const createDependImport = (dependList: string[], source: string) => {
  return `import {${
    BREAK_LINE
  }${indent()}${dependList.join(`,${
    BREAK_LINE
  }${indent()}`)},${
    BREAK_LINE
  }} from '${source}';${BREAK_LINE}`;
};

// 根据props生成响应式变量
const createRefVariables = () => {
  return Object.entries(renderProps.value).map(([key, value]) => {
    const curPropInfo = componentWiki.value.props.find(item => item.name === key);
    if (curPropInfo) {
      let curValue;
      if (curPropInfo.type === 'string' || typeof value === 'string') {
        curValue = `'${value}'`;
      } else if (curPropInfo.type === 'object' || typeof value === 'object') {
        if (Array.isArray(value)) {
          // 判断是否为简单数组（所有元素都不是对象）
          const isSimpleArray = value.every(item => typeof item !== 'object');
          curValue = isSimpleArray
            ? `[${value.map(v => JSON.stringify(v)).join(', ')}]`  // 简单数组不换行
            : formatComplexArray(value);  // 复杂数组换行
        } else {
          curValue = formatComplexValue(value);
        }
      } else {
        curValue = value;
      }

      return `const ${camelKey(key)} = ref(${curValue});`;
    }
    return '';
  })
    .join(BREAK_LINE);
};

// 递归格式化复杂数组
const formatComplexArray = (arr: any[], indentLevel = 1): string => {
  // 判断是否为简单数组（所有元素都是基本类型或null/undefined）
  const isSimpleArray = arr.every(item => item === null
    || item === undefined
    || ['string', 'number', 'boolean'].includes(typeof item));

  if (isSimpleArray) {
    // 简单数组单行输出
    const items = arr.map((item) => {
      if (item === undefined) return 'undefined';  // 明确处理undefined
      if (item === null) return 'null';
      return typeof item === 'string' ? `'${item}'` : String(item);
    });
    return `[${items.join(', ')}]`;
  }

  // 复杂数组多行格式化
  const items = arr.map((item) => {
    if (item === undefined) return `${INDENT.repeat(indentLevel)}undefined,`;
    if (item === null) return `${INDENT.repeat(indentLevel)}null,`;
    if (typeof item === 'object') {
      return `${INDENT.repeat(indentLevel)}${formatComplexValue(item, indentLevel + 1)},`;
    }
    return `${INDENT.repeat(indentLevel)}${typeof item === 'string' ? `'${item}'` : item},`;
  });

  return `[${BREAK_LINE}${items.join(BREAK_LINE)}${BREAK_LINE}${INDENT.repeat(indentLevel - 1)}]`;
};

// 递归格式化复杂值（对象/数组）
const formatComplexValue = (obj: any, indentLevel = 1): string => {
  if (obj === null) {
    return 'null';
  }
  if (obj === undefined) {
    return 'undefined';
  }
  if (Array.isArray(obj)) {
    return formatComplexArray(obj, indentLevel);
  }
  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  const entries = Object.entries(obj);
  const formatted = entries.map(([key, val]) => {
    let valueStr;
    if (val === null) {
      valueStr = 'null';
    } else if (val === undefined) {
      valueStr = 'undefined';
    } else if (typeof val === 'object') {
      valueStr = formatComplexValue(val, indentLevel + 1);
    } else {
      valueStr = JSON.stringify(val);
    }
    return `${INDENT.repeat(indentLevel)}${key}: ${valueStr},`;
  });
  return entries.length
    ? `{${BREAK_LINE}${formatted.join(BREAK_LINE)}${BREAK_LINE}${INDENT.repeat(indentLevel - 1)}}`
    : `{}`;
};

// 获取script标签内容
const scriptContent = () => {
  // 依赖列表
  const dependList = ['ref'];
  const importDepend = createDependImport(dependList, 'vue');
  return `${importDepend}${BREAK_LINE}${createRefVariables()}`;
};

// highlight处理
const highlightFactory = (
  content: string,
  language: 'xml' | 'typescript' | 'javascript' = 'xml',
) => hljs.highlight(content, { language }).value;

// 切换语言
const toggleLanguage = ({
  value,
  disabled,
}: LanguageItem) => {
  if (disabled) {
    return;
  }
  activeLanguage.value = value;
};

const getCode = () => {
  return template()
    + `${BREAK_LINE}${scriptStart.value}`
    + `${BREAK_LINE}${scriptContent()}${BREAK_LINE}`
    + `${scriptEnd}${BREAK_LINE}`;
};

// 复制代码
const handleCopyCode = async () => {
  try {
    await copy(getCode());
    Message({
      message: '复制成功',
      theme: 'success',
      delay: 1500,
    });
  } catch (err) {
    console.error(err);
    Message({
      message: '复制失败',
      theme: 'error',
      delay: 1500,
    });
  }
};

onBeforeMount(() => {
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
});
</script>

<style lang="postcss" scoped>
.code-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #242424;
  position: relative;
  overflow: hidden;

  .code-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    background-color: #2E2E2E;
    width: 100%;
    height: 36px;

    .language-items {
      color: #C4C6CC;
      background-color: #2E2E2E;
      height: 36px;
      line-height: 36px;
      text-align: center;
      min-width: 120px;
      cursor: pointer;
    }

    .active-language-item {
      color: #FFFFFF;
      background-color: #242424;
      position: relative;

      &::before {
        content: '';
        height: 3px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #1768EF;
      }
    }

    .disabled-language-item {
      cursor: not-allowed;
    }
  }
  .code-content {
    flex: 1;
    overflow: auto;
    padding: 16px 24px;
    font-size: 14px;
    background-color: #242424;
    color: #abb2bf;

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #636366;
      border-radius: 3px;

      &:hover {
        background-color: #7D7D7F;
      }
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    /* 解决白色方块问题 */
    &::-webkit-scrollbar-corner {
      background-color: transparent; /* 设为透明 */
    }
  }

  .code-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    padding-left: 24px;
    padding-bottom: 12px;
    z-index: 1;

    .copy-button {
      margin-top: 4px;
    }
  }
}
</style>


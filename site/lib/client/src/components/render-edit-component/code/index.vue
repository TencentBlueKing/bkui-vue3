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
<code v-html="filterXss(curScript)"></code><code v-html="filterXss(highlightFactory(scriptEnd, 'xml'))"></code>
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
  PropItem,
  ValueType,
} from '@/types/component';

import {
  useClipboard,
} from '@vueuse/core';

import 'highlight.js/styles/atom-one-dark.css'; // 代码块高亮样式
import {
  parseStringTemplate,
  serializeElementTree,
} from './template-parser';

import { camelKey } from '@/utils'

type Languages = 'javascript' | 'typescript';
interface IProps {
  componentWiki: IComponentWiki;
  renderProps: Record<string, ValueType>;
  renderSlots: Record<string, string>;
  index: number;
}
interface LanguageItem<T = Languages> {
  name: string;
  value: T;
  disabled: boolean;
}
const props = defineProps<IProps>();

// 换行符
const BREAK_LINE = '\n';
// 最小缩进单位
const INDENT = '  ';
// script标签结束
// eslint-disable-next-line no-useless-escape
const scriptEnd = '<\/script>';
// clickoutside指令
const clickoutsideDirective = 'clickoutside';
// 指令组件
const directiveComponents = ['tooltips', 'ellipsis', clickoutsideDirective];
// 函数组件
const functionComponents = ['notify', 'info-box', 'message'];

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
// 是否为指令组件
const isDirectiveComponent = computed(() => directiveComponents.includes(componentWiki.value.name));
// 是否为函数组件
const isFunctionComponent = computed(() => functionComponents.includes(componentWiki.value.name));

// template 缩进处理
const indent = (num = 1) => new Array(num)
  .fill(INDENT)
  .join('');

// 创建标签
const createLabel = (
  name: string,
  slot: string,
  prefix = '',
  props: Record<string, ValueType> = {},
  endLabelName = '',
) => {
  // 属性列表处理
  const propsList = Object.keys(props).map((key) => {
    return ` :${key}="${camelKey(key)}"`;
  });
  // slot处理
  const curEndLabelName = endLabelName || name;
  return `<${prefix}${name}${propsList.join('')}>${slot}</${prefix}${curEndLabelName}>`;
};

// slot生成
const createSlots = () => {
  return Object.entries(renderSlots.value).map(([key, value]) => {
    const slotParamsList = componentWiki.value?.slots?.find(item => item.name === key)?.params;
    let slotParamsStr = '';
    if (Array.isArray(slotParamsList)) {
      slotParamsStr = `="{ ${slotParamsList.map(item => item.name).join(', ')} }"`;
    }
    const curSlotName = (key === 'default' && !slotParamsStr) ? '' : ` #${key}${slotParamsStr}`;
    const name = `template${curSlotName}`;
    return createLabel(name, value.trim(), '', {}, 'template');
  }).join('');
};

// template生成
const template = () => {
  if (isDirectiveComponent.value) {
    return createDirectiveTemplate();
  } else if (isFunctionComponent.value) {
    return createFunctionTemplate();
  }
  return createCommonTemplate();
};

// 生成通用模板
const createCommonTemplate = () => {
  const str =  createLabel(
    'template',
    createLabel(
      componentWiki.value.name,
      createSlots(),
      'bk-',
      renderProps.value,
    ),
  );
  const elementTree = parseStringTemplate(str);
  return serializeElementTree(elementTree, 0, true);
};

// 生成指令模板
const createDirectiveTemplate = () => {
  if (!isNaN(props.index) && props.index >= 0 && props.index < componentWiki.value.presets.length) {
    const template = componentWiki.value.presets[props.index]?.template || '';
    const str = `<template>${template.trim()}</template>`;
    const elementTree = parseStringTemplate(str);
    return serializeElementTree(elementTree, 0, true);
  }
  return '';
};

// 生成函数模板
const createFunctionTemplate = () => {
  const str = `<template>
    <bk-button
      theme="primary"
      @click="handleShow"
    >
      点击展示组件
    </bk-button>
  </template>`;
  const elementTree = parseStringTemplate(str);
  return serializeElementTree(elementTree, 0, true);
};

// 生成依赖导入
const createDependImport = (dependList: string[], source: string, isType = false) => {
  if (dependList.length === 0) return '';
  let typeStr = isType ? ' type' : '';
  return `import${typeStr} {${
    BREAK_LINE
  }${indent()}${dependList.join(`,${
    BREAK_LINE
  }${indent()}`)},${
    BREAK_LINE
  }} from '${source}';`;
};

// 根据props生成响应式变量
const createRefVariables = () => {
  return Object.entries(renderProps.value).map(([key, value]) => {
    const curPropInfo = componentWiki.value.props.find(item => item.name === key);
    if (curPropInfo) {
      const curValue = createValue(curPropInfo, value)
      const isTypeScript = activeLanguage.value === 'typescript';
      if (isTypeScript) {
        const type = `${toPascalCase(componentWiki.value.name)}Props['${(toPascalCase(key, false))}']`;
        return `const ${camelKey(key)} = ref<${type}>(${curValue});`;
      }
      return `const ${camelKey(key)} = ref(${curValue});`;
    }
    return '';
  })
    .filter(item => item)
    .join(BREAK_LINE);
};

const createValue = (curPropInfo: PropItem, value: unknown) => {
  let curValue;
  if (curPropInfo.type === 'string' || typeof value === 'string') {
    // 模板字符串处理
    if ((value as string).includes('\n')) {
      curValue = `\`${value}\``;
    } else {
      curValue = `'${value}'`;
    }
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
  return curValue;
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
  if (isFunctionComponent.value) {
    return createFunctionScript();
  }
  if (componentWiki.value.name === clickoutsideDirective) {
    return createClickOutSideScript();
  }
  return createCommonScript();
};

// 生成通用script
const createCommonScript = () => {
  // 依赖列表
  const dependList = ['ref'];
  const importDepend = createDependImport(dependList, 'vue');
  const variables = createRefVariables();

  if (activeLanguage.value === 'typescript') {
    const curTypeList = [`${toPascalCase(componentWiki.value.name)}Props`];
    const importTypeDepend = createDependImport(curTypeList, 'bkui-vue', true);
    if (variables) {
      return `${importTypeDepend ? `${importTypeDepend}${BREAK_LINE}` : ''}${importDepend}${BREAK_LINE}${BREAK_LINE}${variables}${BREAK_LINE}`;
    }
    return '';
  }
  if (variables) {
    return `${importDepend}${BREAK_LINE}${BREAK_LINE}${variables}${BREAK_LINE}`;
  }
  return '';
};

// 将连接形式/下划线/空格分隔的名称转为 PascalCase，例如：info-box -> InfoBox
const toPascalCase = (str: string = '', capitalizeFirst: boolean = true): string => {
  if (!str) return '';
  const result = str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(s => s ? s[0].toUpperCase() + s.slice(1) : '')
    .join('');
  
  if (!capitalizeFirst && result.length > 0) {
    return result[0].toLowerCase() + result.slice(1);
  }
  
  return result;
};

// 生成函数组件script
const createFunctionScript = () => {
  const propsContent = Object.entries(renderProps.value).map(([key, value]) => {
    const curPropInfo = componentWiki.value.props.find(item => item.name === key);
    const curValue = createValue(curPropInfo, value);
    return `${key}: ${curValue}`;
  }).join(`,${BREAK_LINE}${indent(2)}`);

  // 依赖列表
  const dependList = [toPascalCase(componentWiki.value.name)];
  const importDepend = createDependImport(dependList, 'bkui-vue');

  return `${importDepend}${BREAK_LINE}
const handleShow = () => {
  ${toPascalCase(componentWiki.value.name)}({
    ${propsContent}
  });
};
`;
};

// 指令clickoutside特殊处理
const createClickOutSideScript = () => {
  // 依赖列表
  const dependList = ['Message'];
  const importDepend = createDependImport(dependList, 'bkui-vue');
  return `${importDepend}${BREAK_LINE}
const handleClickOutside = () => {
  Message({
    message: '点击了外部区域',
    theme: 'primary',
  });
};
`
}

// 开头首字母大写
const capitalize = (str = '') => {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
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


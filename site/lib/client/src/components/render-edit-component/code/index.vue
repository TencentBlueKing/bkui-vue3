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
<code v-html="filterHighlightXssFactory(templateContent())"></code>

<code v-html="filterHighlightXssFactory(generateHtmlTag('script', 'start', scriptSuffix))"></code>
<code v-html="filterHighlightXssFactory(scriptContent(), { language: activeLanguage })"></code><code v-html="filterHighlightXssFactory(generateHtmlTag('script'))"></code>
<template v-if="isShowCss">
<code v-html="filterHighlightXssFactory(generateHtmlTag('style', 'start', 'scoped'))"></code>
<code v-html="filterHighlightXssFactory(cssContent(), { language: 'css' })"></code>
<code v-html="filterHighlightXssFactory(generateHtmlTag('style'))"></code>
</template>
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
  Button as bkButton,
} from 'bkui-vue';
import {
  computed,
  ref,
  toRefs,
} from 'vue';

import {
  copyToClipboard,
} from '@/common/util';
import type {
  ILanguage,
} from '@/hooks/use-highlighjs';
import {
  useHighLightJs,
} from '@/hooks/use-highlighjs';
import type {
  CodeLanguages,
  IComponentWiki,
  ValueType,
} from '@/types/component';

import {
  filterXss,
} from '@blueking/xss-filter';

import {
  BREAK_LINE,
  clickoutsideDirective,
  directiveComponents,
  functionComponents,
} from './constant';
import {
  applySpecialComponentProps,
  applySpecialEvents,
  applySpecialPreset,
  applySpecialRenderProps,
  findSpecialConfig,
} from './extra';
import {
  renderCssStyle,
} from './parser/css/style-parser';
import {
  createCommonScript,
} from './parser/script/type/common';
import {
  createClickOutSideScript,
} from './parser/script/type/directive';
import {
  createFunctionScript,
} from './parser/script/type/method';
import {
  createCommonTemplate,
} from './parser/template/type/common';
import {
  createDirectiveTemplate,
} from './parser/template/type/directive';
import {
  createFunctionTemplate,
} from './parser/template/type/method';
import {
  generateHtmlTag,
} from './util';

import 'highlight.js/styles/atom-one-dark.css'; // 代码块高亮样式

interface IProps {
  componentWiki: IComponentWiki;
  renderProps: Record<string, ValueType>;
  renderSlots: Record<string, string>;
  index: number;
}
interface LanguageItem<T = CodeLanguages> {
  name: string;
  value: T;
  disabled: boolean;
}
const activeLanguage = defineModel<CodeLanguages>('activeLanguage', { default: 'typescript' });
const props = defineProps<IProps>();

const { highlightFactory } = useHighLightJs();

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

const {
  name: componentName,
  presets: componentPresets,
  props: componentProps,
  slots: componentSlots,
  types: componentTypes,
} = toRefs(componentWiki.value);


// script tag 后缀
const scriptSuffix = computed(() => {
  const lang = activeLanguage.value === 'typescript' ? 'lang="ts"' : '';
  return `${lang} setup`;
});

// 是否为指令组件
const isDirectiveComponent = computed(() => directiveComponents.includes(componentName.value));
// 是否为函数组件
const isFunctionComponent = computed(() => functionComponents.includes(componentName.value));

// 当前匹配的特殊配置
const currentSpecialConfig = computed(() => findSpecialConfig(componentName.value, componentPresets.value[props.index]?.title));

// 当前使用的预设
const curPreset = computed(() => {
  if (!isNaN(props.index) && props.index >= 0 && props.index < componentPresets.value.length) {
    // 使用深拷贝避免修改原始数据导致栈溢出
    const curPreset = JSON.parse(JSON.stringify(componentPresets.value[props.index]));
    // 应用特殊配置（如果有）
    return applySpecialPreset(curPreset, currentSpecialConfig.value);
  }
  return null;
});

// 是否可以生成style
const isShowCss = computed(() => curPreset.value?.style && typeof curPreset.value.style === 'string');

/** 特殊处理的renderProps - 基于配置自动扩展 */
const specialRenderProps = computed(() => applySpecialRenderProps(renderProps.value, currentSpecialConfig.value));

/** 特殊处理的componentProps - 基于配置自动扩展 */
// eslint-disable-next-line @stylistic/max-len
const specialComponentsProps = computed(() => applySpecialComponentProps(componentProps.value, currentSpecialConfig.value));

/** 特殊处理的presetEvents - 基于配置自动扩展 */
const specialPresetEvents = computed(() => {
  const curEvents = curPreset.value?.events || {};
  return applySpecialEvents(curEvents, currentSpecialConfig.value);
});

// filterXss处理过的highlight
const filterHighlightXssFactory = (
  htmlContent: string,
  { language = 'xml' }: { language?: ILanguage } = {},
) => filterXss(highlightFactory(htmlContent, language));

// template生成
const templateContent = () => {
  if (isDirectiveComponent.value) {
    return createDirectiveTemplate(
      curPreset.value,
      specialRenderProps.value,
      componentName.value,
    );
  } if (isFunctionComponent.value) {
    return createFunctionTemplate();
  }
  return createCommonTemplate(
    specialRenderProps.value,
    specialComponentsProps.value,
    renderSlots.value,
    componentName.value,
    componentSlots?.value,
    curPreset.value?.events || {},
  );
};

// script生成
const scriptContent = () => {
  if (isFunctionComponent.value) {
    return createFunctionScript(
      specialRenderProps.value,
      specialComponentsProps.value,
      componentName.value,
    );
  }
  if (componentName.value === clickoutsideDirective) {
    return createClickOutSideScript();
  }
  return createCommonScript(
    curPreset.value,
    specialRenderProps.value,
    specialComponentsProps.value,
    renderSlots.value,
    activeLanguage.value === 'typescript',
    componentName.value,
    specialPresetEvents.value,
    componentTypes?.value || [],
  );
};

// css生成
const cssContent = () => {
  if (isShowCss.value) {
    return renderCssStyle(curPreset.value.style);
  }
  return '';
};

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

// 获取复制代码内容
const getCode = () => {
  const styleTemplate = isShowCss.value
    ? BREAK_LINE
    + generateHtmlTag('style', 'start', 'scoped')
    + BREAK_LINE
    + cssContent()
    + BREAK_LINE
    + generateHtmlTag('style')
    + BREAK_LINE
    : '';
  return templateContent()
    + BREAK_LINE.repeat(2)
    + generateHtmlTag('script', 'start', scriptSuffix.value)
    + BREAK_LINE
    + scriptContent()
    + generateHtmlTag('script')
    + BREAK_LINE
    + styleTemplate;
};

// 复制代码
const handleCopyCode = () => {
  copyToClipboard(getCode());
};
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

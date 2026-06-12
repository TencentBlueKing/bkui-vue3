<template>
  <section class="markdown-container">
    <!-- 主内容区域 -->
    <!-- eslint-disable vue/no-v-html -->
    <section class="markdown-body-content">
      <main
        v-html="getMarkdownHtml()"
        class="markdown-body"
      />
    </section>
    <!-- eslint-enable vue/no-v-html -->

    <!-- 侧边导航栏 -->
    <render-side-navgation v-if="navItems.length" :nav-items="navItems" :container-class-name="containerClassName" />
  </section>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import { computed } from 'vue';

import { filterXss } from '@blueking/xss-filter';

import RenderSideNavgation from '../render-side-navgation/index.vue';

import 'highlight.js/styles/atom-one-dark.css';

interface IProps {
  content: string;
  parseTagList?: string[];
  containerClassName?: string;
}

// 导航项数据
interface NavItem {
  id: string;
  title: string;
}

const props = withDefaults(defineProps<IProps>(), {
  parseTagList: () => ['h2'],
});

// 注册语言（registerLanguage 会自动注册各语言的别名，如 js、ts、sh、html 等）
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('less', less);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('plaintext', plaintext);
// Vue 单文件以 HTML 模板为主，使用 xml 语法可同时高亮 template / 内嵌 script / style
hljs.registerLanguage('vue', xml);

// 将标题转换为合法的 id
const titleToId = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, ''); // 保留中文字符
};

const headingConfigs = computed(() => (props.parseTagList ?? [])
  .map((tag) => {
    const match = tag.match(/^h([1-6])$/i);
    if (!match) {
      return null;
    }
    const level = Number(match[1]);
    return {
      tag: `h${level}`.toLowerCase(),
      regex: new RegExp(`^${'#'.repeat(level)}\\s+(.+)$`),
    };
  })
  .filter((item): item is { tag: string; regex: RegExp } => Boolean(item)));

// 解析 markdown 内容，提取所有标题
const navItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [];
  const lines = props.content.split('\n');

  lines.forEach((line) => {
    for (const config of headingConfigs.value) {
      const match = line.match(config.regex);
      if (match) {
        const title = match[1].trim();
        const id = titleToId(title);
        items.push({ id, title });
        break;
      }
    }
  });

  return items;
});

// 配置 markdown-it 实例
const md = new MarkdownIt({
  html: true,           // 允许 HTML 标签
  linkify: true,        // 自动转换 URL 为链接
  typographer: true,    // 启用排版优化
  breaks: true,         // 将换行符转换为 <br>
  highlight: (str: string, lang: string) => {
    // 指定了已注册的语言：按该语言高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch {
        // 高亮失败时降级为自动识别
      }
    }
    // 未指定语言或语言未注册：自动识别，尽量保证有高亮效果
    try {
      const { value, language } = hljs.highlightAuto(str);
      return `<pre class="hljs"><code class="language-${language ?? ''}">${value}</code></pre>`;
    } catch {
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  },
}).use(MarkdownItContainer, 'info', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (tokens: any[], idx: number) => {
    const token = tokens[idx];
    return token.type === 'container_info_open'
      ? '<div class="custom-container info">'
      : '</div>';
  },
});

// 自定义 heading 渲染规则
/* eslint-disable @typescript-eslint/no-explicit-any */
const defaultHeadingOpen = md.renderer.rules.heading_open
  || function (tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.heading_open = function (
  tokens: any,
  idx: any,
  options: any,
  env: any,
  self: any,
) {
  const token = tokens[idx];
  const level = token.tag;

  // 只处理指定的标题标签
  if (headingConfigs.value.some(config => config.tag === level)) {
    // 获取标题内容（下一个 token 是 inline，包含实际文本）
    const inlineToken = tokens[idx + 1];
    if (inlineToken && inlineToken.type === 'inline') {
      const title = inlineToken.content;
      const id = titleToId(title);
      token.attrSet('id', id);
    }
  }

  return defaultHeadingOpen(tokens, idx, options, env, self);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const getMarkdownHtml = () => {
  const rawHtml = md.render(props.content);
  // 使用 filterXss 过滤
  return filterXss(
    rawHtml,
    {
      imgSrcMode: 'none',
    },
  );
};
</script>

<style scoped lang="postcss">
.markdown-container {
  display: flex;
  gap: 24px;
  width: 100%;
}

.markdown-body-content {
  width: calc(100% - 146px);
  padding: 24px;
  background-color: #fff;
}

:deep(.markdown-body) {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  overflow-wrap: break-word;

  >*:first-child {
    margin-top: 0 !important;
  }

  h1,h2,h3,h4,h5,h6,p,hr,li,img {
    padding: 0;
    margin: 0;
    font-family: PingFangSC, PingFangSC-Medium;
    border-bottom: none;
  }

  h1,h2,h3,h4,h5,h6 {
      font-family: PingFangSC, PingFangSC-Medium;
  }

  h1 {
      margin-top: 40px;
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: #000;
      text-align: left;
  }

  h2 {
      margin-top: 40px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: #000;
      text-align: left;
  }

  h3 {
      margin-top: 30px;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      color: #000;
      text-align: left;
  }

  h4,h5,h6 {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      color: #000;
      text-align: left;
  }

  p {
      margin-top: 8px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: #63656e;
      text-align: left;
  }

  hr {
      margin-top: 40px;
      border: none;
      border-top:1px solid #dcdee5;
  }

  ul {
    padding-left: 0;
  }

  li {
      margin-top: 4px;
      margin-left: 17px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #63656e;
      text-align: left;
      list-style: disc;
  }

  img {
      max-width: 100%;
      margin-top: 10px;
  }

  a {
    color: #3a84ff;
  }

  /* 表格样式 */
  table {
    display: block;
    width: 100%;
    margin: 16px 0;
    overflow-x: auto;
    font-size: 14px;
    border-collapse: collapse;
  }

  table th,
  table td {
    padding: 8px 16px;
    line-height: 22px;
    text-align: left;
    border: 1px solid #dcdee5;
  }

  table th {
    font-weight: 500;
    color: #313238;
    background-color: #f5f7fa;
  }

  table td {
    color: #63656e;
  }

  table tr:nth-child(even) td {
    background-color: #fafbfd;
  }

  /* 行内代码 */
  code {
    padding: 2px 6px;
    margin: 0 2px;
    font-family: 'Roboto Mono', Consolas, Monaco, monospace;
    font-size: 13px;
    color: #e96900;
    background-color: #f5f7fa;
    border-radius: 2px;
  }

  /* 代码块 */
  pre {
    margin: 16px 0;
    overflow: auto;
    font-size: 13px;
    line-height: 1.6;
    border-radius: 4px;
  }

  pre code {
    display: block;
    padding: 16px;
    margin: 0;
    font-family: 'Roboto Mono', Consolas, Monaco, monospace;
    color: inherit;
    background: transparent;
    border-radius: 0;
  }

  .custom-container {
    padding: 0;
    margin: 16px 0;
    border-left: 4px solid;
    border-radius: 2px;

    p {
      padding: 8px 16px;
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
    }

    .custom-container-content {
      padding: 8px 16px 16px;

      p:first-child {
        margin-top: 0;
      }

      p:last-child {
        margin-bottom: 0;
      }
    }

    /* info 容器 */
    &.info {
      background-color: #f0f5ff;
      border-left-color: #3a84ff;

      .custom-container-title {
        color: #3a84ff;
      }
    }

    /* warning 容器 */
    &.warning {
      background-color: #fff8e6;
      border-left-color: #ff9c01;

      .custom-container-title {
        color: #ff9c01;
      }
    }

    /* danger 容器 */
    &.danger {
      background-color: #ffeded;
      border-left-color: #ea3636;

      .custom-container-title {
        color: #ea3636;
      }
    }

    /* tip 容器 */
    &.tip {
      background-color: #e5f6ea;
      border-left-color: #2dcb56;

      .custom-container-title {
        color: #2dcb56;
      }
    }

    /* details 容器 */
    &.details {
      background-color: #f5f7fa;
      border-left-color: #979ba5;

      .custom-container-title {
        color: #63656e;
      }
    }
  }
}
</style>

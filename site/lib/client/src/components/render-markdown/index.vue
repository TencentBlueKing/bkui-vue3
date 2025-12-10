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
import javascript from 'highlight.js/lib/languages/javascript';
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

// 注册语言
hljs.registerLanguage('javascript', javascript);

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
    // 代码高亮函数
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code class="language-${lang}">${
        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      }</code></pre>`;
    }
    // 没有指定语言或高亮失败时，使用转义的纯文本
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
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
  width: 100%;
  gap: 24px;
}

.markdown-body-content {
  width: calc(100% - 146px);
  background-color: #fff;
  padding: 24px;
}

:deep(.markdown-body) {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;

  >*:first-child {
    margin-top: 0 !important;
  }

  h1,h2,h3,h4,h5,h6,p,hr,li,img {
    margin: 0;
    padding: 0;
    border-bottom: none;
    font-family: PingFangSC, PingFangSC-Medium;
  }
  h1,h2,h3,h4,h5,h6 {
      font-family: PingFangSC, PingFangSC-Medium;
  }
  h1 {
      margin-top: 40px;
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: 500;
      text-align: left;
      color: #000;
      line-height: 28px;
  }
  h2 {
      margin-top: 40px;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #000;
      line-height: 24px;
  }
  h3 {
      margin-top: 30px;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: #000;
      line-height: 22px;
  }
  h4,h5,h6 {
      margin-top: 20px;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      color: #000000;
      line-height: 22px;
  }
  p {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #63656e;
      line-height: 24px;
      font-family: PingFangSC, PingFangSC-Regular;
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
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #63656e;
      line-height: 22px;
      font-family: PingFangSC, PingFangSC-Regular;
      list-style: disc;
  }
  img {
      margin-top: 10px;
      max-width: 100%;
  }
  a {
    color: #3a84ff;
  }

  .custom-container {
    margin: 16px 0;
    padding: 0;
    border-radius: 2px;
    border-left: 4px solid;

    p {
      margin: 0;
      padding: 8px 16px;
      font-weight: 500;
      font-size: 14px;
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

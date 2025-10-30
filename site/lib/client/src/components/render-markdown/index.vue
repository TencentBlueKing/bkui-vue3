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
    <aside
      v-if="navItems.length > 0"
      class="sidebar"
    >
      <nav>
        <ul class="nav-list">
          <li
            v-for="item in navItems"
            :key="item.id"
          >
            <a
              :href="`#${item.id}`"
              class="nav-link"
              :class="{ active: activeAnchor === item.id }"
              @click="handleNavClick(item.id)"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </section>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import 'highlight.js/styles/atom-one-dark.css';

interface IProps {
  content: string;
}

// 导航项数据
interface NavItem {
  id: string;
  title: string;
}

const props = defineProps<IProps>();

// 注册语言
hljs.registerLanguage('javascript', javascript);

// 路由相关
const route = useRoute();

// 当前激活的锚点
const activeAnchor = ref('');

// 滚动容器
const scrollContainer = ref<HTMLElement | null>(null);

// 是否正在点击导航滚动（用于暂停滚动监听）
const isClickScrolling = ref(false);

// 点击滚动的定时器
let scrollTimer: ReturnType<typeof setTimeout> | null = null;

// 将标题转换为合法的 id
const titleToId = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, ''); // 保留中文字符
};

// 解析 markdown 内容，提取所有 H2 标题
const navItems = computed<NavItem[]>(() => {
  const items: NavItem[] = [];
  const lines = props.content.split('\n');

  lines.forEach((line) => {
    // 匹配 ## 开头的标题（H2）
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const title = h2Match[1].trim();
      const id = titleToId(title);
      items.push({ id, title });
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

// 自定义 heading 渲染规则，为 H2 添加 id
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

  // 只处理 H2 标签
  if (level === 'h2') {
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
  return md.render(props.content);
};


// 监听滚动，更新激活的锚点
const handleScroll = () => {
  // 如果正在点击导航滚动，不处理滚动事件
  if (isClickScrolling.value) return;

  const container = scrollContainer.value;
  if (!container) return;

  const { scrollTop } = container;
  const offset = 100; // 偏移量

  // 查找当前滚动位置对应的锚点
  for (let i = navItems.value.length - 1; i >= 0; i--) {
    const item = navItems.value[i];
    const element = document.getElementById(item.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const elementTop = rect.top - containerRect.top + scrollTop;

      if (scrollTop >= elementTop - offset) {
        activeAnchor.value = item.id;
        return;
      }
    }
  }

  // 如果没有找到，默认激活第一个
  if (navItems.value.length > 0) {
    activeAnchor.value = navItems.value[0].id;
  }
};

// 处理导航点击
const handleNavClick = (id: string) => {
  // 立即更新激活状态
  activeAnchor.value = id;

  // 标记为点击滚动，暂停滚动监听
  isClickScrolling.value = true;

  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  // 等待滚动动画完成后，恢复滚动监听
  scrollTimer = setTimeout(() => {
    isClickScrolling.value = false;
    scrollTimer = null;
  }, 1500);
};

const updateActiveAnchor = () => {
  // 避免滚动动画过程中再次触发滚动事件影响定位精度
  isClickScrolling.value = true;
  const hash = route.hash?.replace('#', '');
  if (hash && navItems.value.some(item => item.id === hash)) {
    activeAnchor.value = hash;
    // 等待内容渲染完成再滚动
    setTimeout(() => {
      const el = document.getElementById(hash);
      // 滚动到锚点
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // 等待滚动动画完成后，恢复滚动监听
      scrollTimer = setTimeout(() => {
        isClickScrolling.value = false;
        scrollTimer = null;
      }, 1500);
    });
  } else {
    activeAnchor.value = navItems.value[0].id;
    // 不需要等待， 立刻恢复滚动监听
    isClickScrolling.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    // 初始化激活的锚点
    updateActiveAnchor();
    // 查找滚动容器
    scrollContainer.value = document.querySelector('.design-home');
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
    }
  });
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
  // 清除定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
});
</script>

<style lang="postcss">
.markdown-container {
  display: flex;
  width: 100%;
  gap: 24px;
  scroll-behavior: smooth;
}

.markdown-body-content {
  flex: 1;
  background-color: #fff;
  padding: 24px;
}

.markdown-body {
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

/* 侧边栏样式 */
.sidebar {
  width: 146px;
  position: sticky;
  max-height: 100%;
  top: 20px;
  overflow-y: auto;
  align-self: flex-start; /* 确保侧边栏从顶部开始 */
}

.nav-list {
  list-style: none;
  padding: 8px 0 4px 0;
  margin: 0;
  border-left: 1px solid #dcdee5;
}

.nav-link {
  display: block;
  color: #313238;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
}

.nav-link:hover {
  color: #1976d2;
  background-color: #f5f7fa;
}

.nav-link.active {
  color: #1976d2;
  font-weight: 500;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 16px;
  width: 2px;
  background-color: #3a84ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: relative;
    max-height: none;
  }
}
</style>

<template>
  <section
    v-html="getMarkdownHtml()"
    class="markdown-body"
  >
  </section>
</template>

<script lang="ts" setup>
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import hljs from 'highlight.js/lib/core';
// 导入需要支持的语言
import javascript from 'highlight.js/lib/languages/javascript';
// 导入样式
import 'highlight.js/styles/atom-one-dark.css';

// 注册语言
hljs.registerLanguage('javascript', javascript);

interface IProps {
  content: string;
}

const props = defineProps<IProps>();

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
  }
}).use(MarkdownItContainer, 'info', {
  render: (tokens: any[], idx: number) => {
    const token = tokens[idx];
    return token.type === 'container_info_open'
    ? `<div class="custom-container info">`
    : `</div>`;
  },
})

const getMarkdownHtml = () => {
  return md.render(props.content);
};
</script>

<style lang="postcss">
.markdown-body {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;

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
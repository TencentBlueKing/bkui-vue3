<template>
  <bk-button theme='primary' @click="show = true">查看日志</bk-button>
  <bk-version-log v-model:show="show" :list="list" @selected="handleSelected">
    <template #detail>
      <div class="log-detail">
        <h3>{{ data.active }} 版本更新日志</h3>
        <div v-for="group in data.content" :key="group.type" class="log-group">
          <h4 class="group-title">{{ group.type }}</h4>
          <ul class="group-content">
            <li v-for="(item, index) in group.detail" :key="index" class="log-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </bk-version-log>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import BkVersionLog from '@bkui-vue/version-log';

  const show = ref(false);
  const data = reactive({
    active: '',
    content: []
  });

  const list = (() => {
    const versions = [];
    for(let i = 0; i < 10; i++) {
      versions.push({
        title: `v1.0.${i}`,
        date: `2024-${i + 1}-01`,
        content: [
          {
            type: '新增',
            detail: [
              '[新增]内置 ES6+ 语言转义能力增强',
              '[新增]任务通知中心',
              '[新增]控制台新增命令 cleanAppCache',
              '[新增]云开发云调用快速启动模板',
              '[新增]插件增加工具回退时的保护机制'
            ]
          },
          {
            type: '优化',
            detail: [
              '[优化]素材管理，不再维护的提示',
              '[优化]任务通知中心',
              '[优化]控制台新增命令 cleanAppCache',
              '[优化]上传时版本号推荐',
              '[优化]project.config.json 中新增设置 uploadWithSourceMap'
            ]
          },
          {
            type: '修复',
            detail: [
              '[修复]体验评分“iPhone X兼容”检验规则',
              '[修复]sitemap，控制台显示当前页面是否索引',
              '[修复]createUDPSocket bindUDPSocket 改为同步接口',
              '[修复]代码保护默认打开',
              '[修复]工具启动默认打开项目',
            ]
          }
        ]
      });
    }
    return versions;
  })();

  const handleSelected = (version) => {
    data.active = version.title;
    data.content = list.find(item => item.title === version.title).content;
  }
</script>
<style lang="postcss">
  .log-detail {
    height: 100%;
    overflow: auto;
  }
  .log-group {
    ul, li {
      list-style: disc;
    }
    ul {
      padding-left: 20px;
    }
  }
</style>

<template>
  <Button theme="primary" @click="showSyncReleaseNote = true">
      查看版本日志
  </Button>
  <ReleaseNote
    v-model:show="showSyncReleaseNote"
    :detail="releaseNoteDetail"
    :list="syncReleaseList"
    :loading="syncReleaseNoteLoading"
    @selected="handleSelectRelease"/>
</template>
<script setup>
  import { ref } from 'vue';
  import { Button } from 'bkui-vue';
  import ReleaseNote from '@blueking/release-note';
  import '@blueking/release-note/vue3/vue3.css';

  const showSyncReleaseNote = ref(false);
  const syncReleaseNoteLoading = ref(false);
  const syncReleaseList = (() => {
    const versions = [];
    for (let i = 0; i < 10; i++) {
      versions.push({
        date: `2024-${i + 1}-01`,
        title: `v1.0.${i}`,
      });
    }
    return versions;
  })();
  const releaseNoteDetail = ref('');
  const showSlotReleaseNote = ref(false);

  const handleSelectRelease = version => {
    syncReleaseNoteLoading.value = true;
    setTimeout(() => {
      releaseNoteDetail.value = `## ${version.title} 版本更新日志 \n ### 新增\n\n- [新增] 内置\` ES6+\` 语言转义能力增强\n- [新增] 任务通知中心\n- [新增] 控制台新增命令 cleanAppCache\n### 优化\n- [优化] 上传时版本号推荐\n- [优化] 云开发云调用快速启动模板\n- [优化] 插件增加工具回退时的保护机制\n- [优化] 素材管理，不再维护的提示\n- [优化] 体验评分支持“iPhone X兼容”检验规则\n### 修复\n- [修复] sitemap，控制台显示当前页面是否索引\n- [优化] project.config.json 中新增设置 uploadWithSourceMap\n- [优化] createUDPSocket bindUDPSocket 改为同步接口\n`;
      syncReleaseNoteLoading.value = false;
    }, 1000);
  };
</script>

<template>
  <suspense>
    <bk-code-diff
      :hljs="hljs"
      :language="state.language"
      :diff-context="state.diffContext"
      diff-format="side-by-side"
      :old-content="OLD_STR"
      :new-content="NEW_STR"
    />
    <template #fallback>
      <bk-loading loading />
    </template>
  </suspense>
</template>

<script setup>

  import hljs from 'highlight.js';
  import { onMounted, reactive, ref } from 'vue';

  import { NEW_STR, OLD_STR } from './demo';

  /**
   * 动态引入语法包
   * [string] language
   */
  function languageDynamicImport(language) {
    switch (language) {
    case 'css':
      return import('highlight.js/lib/languages/css');
    case 'java':
      return import('highlight.js/lib/languages/java');
    case 'javascript':
      return import('highlight.js/lib/languages/javascript');
    case 'json':
      return import('highlight.js/lib/languages/json');
    case 'scss':
      return import('highlight.js/lib/languages/scss');
    case 'less':
      return import('highlight.js/lib/languages/less');
    case 'stylus':
      return import('highlight.js/lib/languages/stylus');
    case 'shell':
      return import('highlight.js/lib/languages/shell');
    case 'bash':
      return import('highlight.js/lib/languages/bash');
    case 'cpp':
      return import('highlight.js/lib/languages/cpp');
    case 'go':
      return import('highlight.js/lib/languages/go');
    case 'xml':
      return import('highlight.js/lib/languages/xml');
    case 'python':
      return import('highlight.js/lib/languages/python');
    case 'typescript':
      return import('highlight.js/lib/languages/typescript');
    case 'sql':
      return import('highlight.js/lib/languages/sql');
    case 'ruby':
      return import('highlight.js/lib/languages/ruby');
    case 'vim':
      return import('highlight.js/lib/languages/vim');
    case 'php':
      return import('highlight.js/lib/languages/php');
    case 'perl':
      return import('highlight.js/lib/languages/perl');
    case 'powershell':
      return import('highlight.js/lib/languages/powershell');
    case 'makefile':
      return import('highlight.js/lib/languages/makefile');
    }
  }

  const languageModuleMap = ref({});
  const state = reactive({
    language: 'javascript',
    diffContext: 20,
  });

  onMounted(async () => {
    let languageModule = languageModuleMap.value[state.language];
    if (languageModule === undefined) {
      const mod = await languageDynamicImport(state.language);
      languageModule = mod.default;

      languageModuleMap.value = {
        ...languageModuleMap.value,
        language: languageModule,
      };
    }
    hljs.registerLanguage(state.language, languageModule);
  });

</script>

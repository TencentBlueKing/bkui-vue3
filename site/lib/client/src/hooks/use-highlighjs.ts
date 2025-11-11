import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';

import {
  onBeforeMount,
} from 'vue';

type ILanguage = 'xml' | 'typescript' | 'javascript' | 'css';

export const useHighLightJs = () => {
  // highlight处理
  const highlightFactory = (
    content: string,
    language: ILanguage = 'xml',
  ) => hljs.highlight(content, { language }).value;

  onBeforeMount(() => {
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('css', css);
  });

  return {
    highlightFactory,
  };
};

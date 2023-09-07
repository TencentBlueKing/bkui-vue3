<template>
  <div>
    <bk-button
      type="primary"
      @click="handleAdvanceShow(null)"
    >
      默认配置
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="error"
      @click="handleAdvanceShow('key-value')"
    >
      key-value显示
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleAdvanceShow('json')"
    >
      JSON显示
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleAdvanceDisabledShow('json')"
    >
      自定义工具列表-不显示助手操作
    </bk-button>
    &nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleAdvanceCustomShow('json')"
    >
      自定义工具列表-只读-自定义Text
    </bk-button>
  </div>
</template>

<script setup>
  import { Message } from 'bkui-vue';

  const  handleAdvanceShow = (type) => {
    const messageConfig = {
      theme: 'error',
      message: {
        code: 10086,
        overview: '算法载入失败。',
        suggestion: '请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。',
        type,
        details: {
              "code": "UNAUTHENTICATED",
              "message": "用户未登录或登录态失效",
              "code1": "UNAUTHENTICATED",
              "message1": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code2": "UNAUTHENTICATED",
              "message2": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code3": "UNAUTHENTICATED",
              "message3": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code4": "UNAUTHENTICATED",
              "message4": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code5": "UNAUTHENTICATED",
              "message5": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code6": "UNAUTHENTICATED",
              "message6": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code7": "UNAUTHENTICATED",
              "message7": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code8": "UNAUTHENTICATED",
              "message8": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code9": "UNAUTHENTICATED",
              "message9": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code10": "UNAUTHENTICATED",
              "message10": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code81": "UNAUTHENTICATED",
              "message81": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code91": "UNAUTHENTICATED",
              "message91": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)",
              "code101": "UNAUTHENTICATED",
              "message101": "用户未登录或登录态失效，请使用登录链接重新登录 (UNAUTHORIZED)"
            },
        assistant: '',
      },
    };
    Message(messageConfig);
  };

  const  handleAdvanceDisabledShow = (type) => {
    const messageConfig = {
      theme: 'error',
      actions: [{
        id: 'assistant',
        disabled: true
      }],
      message: {
        code: 10086,
        overview: '算法载入失败。',
        suggestion: '请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。',
        type,
        details: `{
              "code": "UNAUTHENTICATED"
            }`,
        assistant: '',
      },
    };
    Message(messageConfig);
  };

  const  handleAdvanceCustomShow = (type) => {
    const messageConfig = {
      theme: 'error',
      actions: [
      {
        id: 'fix',
        text: 'FIX',
        onClick: () => { alert('On Click') }
      }
    ],
      message: {
        code: 10086,
        overview: '算法载入失败。',
        suggestion: '请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。请确认文件内容是否正确，并和所选框架匹配。',
        type,
        details: `{
              "code": "UNAUTHENTICATED"
            }`,
        assistant: '',
      },
    };
    Message(messageConfig);
  };
</script>

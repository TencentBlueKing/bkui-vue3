import {
  parseStringTemplate,
  serializeElementTree,
} from "../template-parser";

// 生成函数模板
export const createFunctionTemplate = () => {
  const str = `<template>
    <bk-button
      theme="primary"
      @click="handleShow"
    >
      点击展示组件
    </bk-button>
  </template>`;
  const elementTree = parseStringTemplate(str);
  return serializeElementTree(elementTree, 0, true);
};

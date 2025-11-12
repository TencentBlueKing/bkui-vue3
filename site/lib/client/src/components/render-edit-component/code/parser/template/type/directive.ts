import type {
  IComponentWiki
} from "@/types/component";
import {
  parseStringTemplate,
  serializeElementTree
} from "../template-parser";

// 生成指令模板
export const createDirectiveTemplate = (
  preset: IComponentWiki['presets'][number],
) => {
  if (preset) {
    const template = preset?.template || '';
    const str = `<template>${template.trim()}</template>`;
    const elementTree = parseStringTemplate(str);
    return serializeElementTree(elementTree, 0, true);
  }
  return '';
};

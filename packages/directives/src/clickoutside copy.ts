/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/

import { ObjectDirective, DirectiveBinding } from 'vue';

export interface IOption {
  handler: Function; // 处理函数
  capture: boolean; // 事件处理阶段
  disabled: boolean; // 是否禁用
  events: string[];// 自定义处理事件
  detectIframe: boolean; // 检查iframe之外的点击事件
  exclude: Node[]; // 不希望触发clickOutside的节点
}

export interface IEventData {
  el: HTMLElement;
  event: Event;
  handler: Function;
  disabled: boolean;
}

export interface IEventConfig {
  event: string;
  target: HTMLElement | Window;
  capture: boolean;
  handler: (event: Event) => any;
}

// value为dom节点对应事件配置信息
const nodeMap: Map<HTMLElement, IEventConfig[]> = new Map();

// 统一转换为对象配置类型
function parseBindingValue(value): IOption {
  const isTouch =  'ontouchstart' in window || navigator?.maxTouchPoints > 0;
  const defaultOption: IOption = {
    handler() {},
    capture: true,
    disabled: false,
    detectIframe: true,
    exclude: [],
    events: isTouch ? ['ontouchstart'] : ['click'],
  };
  if (typeof value === 'function') {
    defaultOption.handler = value;
    return defaultOption;
  }
  return Object.assign({}, defaultOption);
}

// 处理点击事件
function onEvent(config: IEventData) {
  const { el, event, handler, disabled } = config;
  const path = event.composedPath?.();
  const isClickOutside = path
    ? path.indexOf(el) < 0
    : !el.contains(event.target as Node);

  if (!isClickOutside || !!disabled) return;

  handler(event);
}

// 处理iframe之外的点击事件
function onIframeClick(config: IEventData) {
  const { activeElement } = document;
  const { el, handler, disabled, event } = config;
  if (
    activeElement
      && activeElement.tagName === 'IFRAME'
      && !el.contains(activeElement) && !disabled
  ) {
    handler(event);
  }
}

// 根据options获取对应的事件配置项
function getEventConfigList(el: HTMLElement, options: IOption) {
  const configList = options.events.map<IEventConfig>(name => ({
    event: name,
    target: document.documentElement,
    capture: options.capture,
    handler: event => onEvent({ el, event, handler: options.handler, disabled: options.disabled  }),
  }));

  if (options.detectIframe) {
    configList.push({
      event: 'blur',
      target: window,
      capture: options.capture,
      handler: event => onIframeClick({ el, event, handler: options.handler, disabled: options.disabled }),
    });
  }

  return configList;
}

// 初始化事件入口
function init(el: HTMLElement, options: IOption) {
  if (nodeMap.has(el)) {
    destroy(el);
  }
  console.error('init');

  const configList = getEventConfigList(el, options);
  nodeMap.set(el, configList);
  configList.forEach((config) => {
    const { target, event, handler, capture } = config;
    target.addEventListener(event, handler, capture);
  });
}

// 销毁资源
function destroy(el: HTMLElement) {
  const configList = nodeMap.get(el) ?? [];
  configList.forEach((config) => {
    const { target, event, handler, capture } = config;
    target.removeEventListener(event, handler, capture);
  });
  nodeMap.delete(el);
}

const clickoutside: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    console.error('beforeMount');
    const options = parseBindingValue(binding.value);
    if (options.disabled) return;

    nodeMap.set(el, getEventConfigList(el, options));
  },
  updated(el, binding: DirectiveBinding) {
    console.error('updated');
    const newOptions = parseBindingValue(binding.value);
    if (newOptions.disabled && !nodeMap.has(el)) return;

    init(el, newOptions);
  },
  unmounted(el) {
    console.error('unmounted');
    destroy(el);
  },
};

export default clickoutside;

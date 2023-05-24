/* eslint-disable no-param-reassign */
/**
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
import { App, Directive, Plugin } from 'vue';
export * from './dom';
export * from './helper';
export * from './hooks/use-form';
export * from './hooks/use-form-item';
export * from './mask-manager';
export * from './pop-manager';
export * from './popover';
export * from './scrollbar-width';
export * from './token';
export * from './utils';
export * from './vue-types';
export * from './z-index-manager';


export function classes(dynamicCls: object, constCls = ''): string {
  return Object.entries(dynamicCls).filter(entry => entry[1])
    .map(entry => entry[0])
    .join(' ')
    .concat(constCls ? ` ${constCls}` : '');
}

export const EMPTY_OBJ = Object.create({});

export const noop = () => { };

export const renderEmptyVNode = () => null;

export const isEmptyObj: (target: object) => boolean = target => Object.keys(target).length < 1;


export interface OriginComponent {
  name: string;
  install?: Plugin;
}
export const withInstall = <T extends OriginComponent>(
  component: T): T & Plugin  => {
  component.install = function (app: App, { prefix } = {}) {
    const pre = app.config.globalProperties.bkUIPrefix || prefix || 'Bk';
    app.component(pre + component.name, component);
  };
  return component as T & Plugin;
};
export const withInstallProps = <T extends OriginComponent, K extends Record<string, unknown>, D extends Directive>(
  component: T,
  childComponents: K,
  isProps = false,
  directive?: {
    name: string;
    directive: D;
  },
) => {
  component.install = function (app: App, { prefix } = {}) {
    const pre = app.config.globalProperties.bkUIPrefix || prefix || 'Bk';
    if (directive) {
      app.directive(pre + directive.name, directive.directive);
    }
    app.component(pre + component.name, component);
    !isProps && Object.values(childComponents).forEach((child: any) => {
      app.component(pre + child.name, child);
    });
  };
  Object.keys(childComponents).forEach((key) => {
    component[key] = childComponents[key];
  });
  return component as T & Plugin & Readonly<typeof childComponents>;
};

/**
 * 解析当前组件ClassName，自动添加前缀
 * @param clsName 当前ClassName
 * @param prefix 前缀，默认为bk
 * @returns prefix-clsName
 */
export function resolveClassName(clsName: string, prefix = 'bk') {
  return `${prefix}-${clsName}`;
}
/**
 * 函数防抖
 * @param {*} fn 执行的函数
 * @param {*} delay 延时时间
 * @param {*} immediate 是否立即执行
 */
export function debounce(delay = 300, fn: Function, immediate = false) {
  let timeout: any;
  let result: any;
  const debounced = function (this: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ctx = this;// 当前上下文
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;// fn的参数

    // 取消之前的延时调用
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const applyImmediate = !timeout; // 是否执行过
      timeout = setTimeout(() => {
        timeout = null;// 标志是否执行过，与clearTimeout有区别，clearTimeout之后timeout不为null而是一个系统分配的队列ID
      }, delay);
      if (applyImmediate) result = fn.apply(ctx, args); // 立即调用
    } else {
      timeout = setTimeout(() => {
        fn.apply(ctx, args);
      }, delay);
    }
    return result;
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

/**
 * 过滤（去除）对象中的某个属性
 * @param data 需要处理的对象
 * @param filter 过滤关键字
 * @returns object 去除属性之后的对象
 */
export function filterProperty(data: object, filter: string[]) {
  return JSON.parse(JSON.stringify(data, (key: string, value: any) => {
    if (filter.includes(key)) {
      return undefined;
    }
    return value;
  }));
};

export function arrayEqual(arr1: Array<string | number | string[]> = [], arr2: Array<string | number | string[]> = []) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i])) {
      return arrayEqual(arr1[i] as string[], arr2[i] as string[]);
    }
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

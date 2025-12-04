import type {
  Component,
  ComponentInstance,
} from 'vue';
import * as vue from 'vue';

import {
  isFunctionString,
  kebabToCamel,
} from '@/common/util';
import type { IProp } from '@/types/component';

import { compile } from '@vue/compiler-dom';

type DependentComponentsMap = Record<string, Record<string, Component>>;

/**
 * 清理函数参数中的类型标注
 */
function cleanFunctionParams(params: string): string {
  return params.replace(/(\w+)\s*:\s*([A-Z][^,)]*|string|number|boolean)/g, '$1');
}

/**
 * 将函数字符串转换为可执行函数
 */
function parseFunctionString(functionCode: string): (...args: unknown[]) => unknown {
  const Fn = Function;
  // 处理箭头函数: (param: Type, param2: Type2) => 或 async (param: Type) =>
  const cleanedCode = functionCode.replace(/(async\s+)?\(([^)]*)\)\s*=>/g, (_match: string, asyncKeyword: string, params: string) => {
    // 去除参数中的类型标注: param: Type -> param
    const cleanParams = cleanFunctionParams(params);
    return `${asyncKeyword || ''}(${cleanParams}) =>`;
  });
  // 转换为实际函数
  return Fn(`return (${cleanedCode})`)();
}

/**
 * 递归处理对象和数组中的函数字符串
 */
function deepParseFunctions(value: unknown): unknown {
  // 如果是函数字符串，转换为函数
  if (isFunctionString(value)) {
    return parseFunctionString(value);
  }

  // 如果是数组，递归处理每个元素
  if (Array.isArray(value)) {
    return value.map(item => deepParseFunctions(item));
  }

  // 如果是对象，递归处理每个属性
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deepParseFunctions(val);
    }
    return result;
  }

  // 其他类型直接返回
  return value;
}

/**
 * 创建依赖属性代理
 */
function createProxy<T>(
  initialValue: T,
  onUpdate: (newValue: T) => void,
): { value: T } {
  let currentValue = initialValue;

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'value') {
          return currentValue;
        }
        return undefined;
      },
      set(_target, prop, newValue) {
        if (prop === 'value') {
          currentValue = newValue;
          onUpdate(newValue);
          return true;
        }
        return false;
      },
    },
  ) as { value: T };
}

/**
 * 处理 events，将事件字符串转换为可执行函数
 */
export function processRenderEvents(
  events: Record<string, string>,
  renderProps: Record<string, unknown>,
  dependentProps: string[],
  emit: (event: 'update:renderProps', value: Record<string, unknown>) => void,
): Record<string, (data?: unknown) => void> {
  // 创建依赖属性代理
  const propsRefs = dependentProps.reduce((acc, prop) => {
    acc[prop] = createProxy(
      renderProps[prop],
      (newValue: unknown) => {
        emit('update:renderProps', {
          ...renderProps,
          [prop]: newValue,
        });
      },
    );
    return acc;
  }, {} as Record<string, { value: unknown }>);
  // 处理 events
  return Object.keys(events).reduce(
    (acc, key) => {
      const Fn = Function;
      // 处理箭头函数: (param: Type, param2: Type2) => 或 async (param: Type) =>
      const eventCode = events[key].replace(/(async\s+)?\(([^)]*)\)\s*=>/g, (_match: string, asyncKeyword: string, params: string) => {
        const cleanParams = cleanFunctionParams(params);
        return `${asyncKeyword || ''}(${cleanParams}) =>`;
      });

      // 例如：'click' -> 'onClick', 'custom-event' -> 'onCustomEvent'
      const eventName = `on${key
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')}`;
      // 创建一个返回该箭头函数的函数，然后立即执行得到箭头函数本身
      const paramNames = Object.keys(propsRefs);
      const paramValues = Object.values(propsRefs);
      acc[eventName] = Fn(...paramNames, `return (${eventCode})`)(...paramValues);
      return acc;
    },
    {} as Record<string, (data?: unknown) => void>,
  );
}

/**
 * 处理 props，将属性值转换为正确的格式
 */
export function processRenderProps(
  renderProps: Record<string, unknown>,
  props: IProp[],
  renderEvents: Record<string, (data?: unknown) => void>,
  emit: (event: 'update:renderProps', value: Record<string, unknown>) => void,
): Record<string, unknown> {
  return Object.keys(renderProps).reduce((acc, key) => {
    const propValue = renderProps[key];
    const prop = props.find(item => kebabToCamel(item.name) === kebabToCamel(key));

    // 判断 prop 是否为函数类型（包含 => 或以 function 开头）
    const isFunctionType = prop.type && (prop.type.includes('=>') || prop.type.startsWith('function'));
    if (isFunctionType) {
      // 如果是函数类型且值是字符串，需要转换为可执行函数
      // 先检查是否是有效的函数字符串，避免将普通字符串误解析为函数 (联合类型：string | Function)
      if (typeof propValue === 'string' && isFunctionString(propValue)) {
        acc[prop.name] = parseFunctionString(propValue);
      } else {
        // 如果不是函数字符串，直接使用原值（可能是普通字符串、VNode、已经是函数等）
        acc[prop.name] = propValue;
      }
    } else {
      // 对于非函数类型，也要递归处理对象和数组中的函数字符串
      // 例如：nav-items 数组中的 action 函数，async 对象中的 callback 函数
      acc[prop.name] = deepParseFunctions(propValue);
    }

    // 处理 v-model 支持
    if (prop.isSupportVModel) {
      // eslint-disable-next-line no-param-reassign
      renderEvents[`onUpdate:${key}`] = (value: unknown) => {
        // 使用原始 renderProps 来查找对应的 key
        const newKey = Object.keys(renderProps).
          find(propKey => kebabToCamel(propKey) === kebabToCamel(key) && propKey !== key);
        // 创建新的 renderProps，基于原始 renderProps 并更新值
        const newRenderProps = { ...renderProps };
        newRenderProps[newKey ?? key] = value;
        emit('update:renderProps', newRenderProps);
      };
    }

    return acc;
  }, {} as Record<string, unknown>);
}

/**
 * 处理 slots，将插槽字符串转换为可执行函数
 */
export function processRenderSlots(renderSlots: Record<string, string>): Record<string, (data?: unknown) => object> {
  return Object.keys(renderSlots).reduce(
    (acc, slotName) => {
      const Fn = Function;
      acc[slotName] = (data?: unknown) => Fn('Vue', 'data', compile(renderSlots[slotName]).code)(vue, data)(vue);
      return acc;
    },
    {} as Record<string, (data?: unknown) => object>,
  );
}

/**
 * 构建依赖组件映射
 */
export function buildDependentComponentsMap(dependentComponents: DependentComponentsMap): Record<string, Component> {
  const map: Record<string, Component> = {};
  Object.keys(dependentComponents).forEach((componentName) => {
    const depComp = dependentComponents[componentName];
    if (!Object.keys(depComp).length) return;

    Object.keys(depComp).forEach((subKey) => {
      if (subKey === 'default') {
        // 转换为 PascalCase: 'bk-menu' -> 'BkMenu'
        const nameWithoutBk = componentName.startsWith('bk-')
          ? componentName.slice(3)
          : componentName;
        const pascalCaseName = `Bk${nameWithoutBk
          .split('-')
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')}`;
        map[pascalCaseName] = depComp.default;
      } else {
        map[subKey] = depComp[subKey];
      }
    });
  });
  return map;
}

/**
 * 注册组件到组件实例
 */
export function registerComponents(
  component: Record<string, Component>,
  dependentComponents: DependentComponentsMap,
  componentInstance: ComponentInstance<Component>,
): void {
  // 注册当前组件的所有子组件
  if (Object.keys(component).length > 1) {
    Object.keys(component).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      componentInstance._.components[key] = component[key];
    });
  }

  // 注册依赖组件
  const dependentComponentsMap = buildDependentComponentsMap(dependentComponents);
  Object.entries(dependentComponentsMap).forEach(([name, comp]) => {
    // 如果组件是函数，则直接注册到 window 上一份，主要在事件中使用调用（带Bk前缀应该不会覆盖，遇到再说）
    if (typeof comp === 'function') {
      (window as unknown as Record<string, unknown>)[name] = comp;
    }
    // eslint-disable-next-line no-param-reassign
    componentInstance._.components[name] = comp;
  });
}


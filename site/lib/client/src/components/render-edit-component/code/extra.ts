/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IComponentWiki,
} from '@/types/component';

/** 特殊处理过的props类型 新增isRef属性用于判断是否为ref 代码展示专用 */
export type SpecialComponentProps = Array<IComponentWiki['props'][number] & { isRef?: boolean }>;

/**
 * 特殊组件扩展配置的类型定义
 */
export interface ISpecialConfig {
  /** 组件名称 */
  componentName: string;
  /** 预设标题（用于匹配特定场景） */
  presetTitle: string;
  /** 扩展的 renderProps */
  extraRenderProps?: Record<string, string>;
  /** 扩展的 componentProps */
  extraComponentProps?: Array<{
    name: string;
    description: string;
    type: string;
    isRef?: boolean;
  }>;
  /** 扩展的 events */
  extraEvents?: Record<string, string>;
  /** 扩展的 dependent.components */
  extraDependentComponents?: string[];
}

/**
 * 特殊组件扩展配置
 * 用于为特定组件在特定场景下添加额外的属性、事件等
 */
export const SPECIAL_CONFIGS: ISpecialConfig[] = [
  {
    // Form 组件的表单校验场景
    componentName: 'form',
    presetTitle: '表单校验',
    // 扩展 renderProps：添加 formRef
    extraRenderProps: {
      formRef: 'formRef',
    },
    // 扩展 componentProps：添加 formRef 的类型定义
    extraComponentProps: [
      {
        name: 'formRef',
        description: '表单实例引用',
        type: 'InstanceType<typeof BkForm>',
        isRef: true,
      },
    ],
    // 扩展 events：添加 validate 方法
    extraEvents: {
      validate: '() => formRef.value.validate();',
    },
    // 扩展 dependent.components：确保包含 Form 组件
    extraDependentComponents: ['Form'],
  },
  // 未来可以在这里添加更多特殊组件配置
  // 例如：
  // {
  //   componentName: 'table',
  //   presetTitle: '表格操作',
  //   extraRenderProps: {
  //     tableRef: {
  //       isRef: true,
  //       value: 'tableRef',
  //     },
  //   },
  //   extraComponentProps: [
  //     {
  //       name: 'tableRef',
  //       description: '表格实例引用',
  //       type: 'InstanceType<typeof BkTable>',
  //       isRef: true,
  //     },
  //   ],
  // },
];

/**
 * 根据组件名称和预设标题查找匹配的特殊配置
 * @param componentName 组件名称
 * @param presetTitle 预设标题
 * @returns 匹配的配置对象，如果没有匹配则返回 null
 */
export function findSpecialConfig(
  componentName: string,
  presetTitle?: string,
): ISpecialConfig | null {
  if (!presetTitle) return null;

  // eslint-disable-next-line @stylistic/max-len
  return SPECIAL_CONFIGS.find(config => config.componentName === componentName && config.presetTitle === presetTitle) || null;
}

/**
 * 应用特殊配置到 renderProps
 * @param baseProps 基础 props
 * @param config 特殊配置
 * @returns 合并后的 props
 */
export function applySpecialRenderProps(
  baseProps: Record<string, any>,
  config: ISpecialConfig | null,
): Record<string, any> {
  if (!config?.extraRenderProps) {
    return { ...baseProps };
  }

  // 先解构移除可能存在的同名属性，确保新属性在第一位且不会被覆盖
  const extraKeys = Object.keys(config.extraRenderProps);
  const rest = Object.keys(baseProps).reduce((acc, key) => {
    if (!extraKeys.includes(key)) {
      acc[key] = baseProps[key];
    }
    return acc;
  }, {} as Record<string, any>);

  return {
    ...config.extraRenderProps,
    ...rest,
  };
}

/**
 * 应用特殊配置到 componentProps
 * @param baseProps 基础 props
 * @param config 特殊配置
 * @returns 合并后的 props
 */
export function applySpecialComponentProps(
  baseProps: SpecialComponentProps,
  config: ISpecialConfig | null,
): SpecialComponentProps {
  if (!config?.extraComponentProps) {
    return [...baseProps];
  }

  return [...baseProps, ...config.extraComponentProps];
}

/**
 * 应用特殊配置到 events
 * @param baseEvents 基础 events
 * @param config 特殊配置
 * @returns 合并后的 events
 */
export function applySpecialEvents(
  baseEvents: Record<string, any>,
  config: ISpecialConfig | null,
): Record<string, any> {
  if (!config?.extraEvents) {
    return { ...baseEvents };
  }

  return {
    ...baseEvents,
    ...config.extraEvents,
  };
}

/**
 * 应用特殊配置到 preset（用于深拷贝后的 preset）
 * @param preset 预设对象（已深拷贝）
 * @param config 特殊配置
 * @returns 修改后的 preset
 */
export function applySpecialPreset(
  preset: any,
  config: ISpecialConfig | null,
): any {
  if (!config?.extraDependentComponents) {
    return preset;
  }

  // 确保 dependent.components 包含所需的组件
  if (!preset.dependent) {
    preset.dependent = {};
  }

  if (!Array.isArray(preset.dependent.components)) {
    preset.dependent.components = [];
  }

  config.extraDependentComponents.forEach((component) => {
    if (!preset.dependent.components.includes(component)) {
      preset.dependent.components.push(component);
    }
  });

  return preset;
}

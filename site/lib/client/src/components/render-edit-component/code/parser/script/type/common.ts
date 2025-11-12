import {
  IComponentWiki,
  ValueType,
} from "@/types/component";
import {
  extractIconNames,
  toPascalCase,
} from "../../template/template-parser";
import {
  BKUI_PATH,
  BREAK_LINE,
  ICON_IMPORT_PATH,
} from "../../../constant";
import {
  createDependImport,
  createValue,
} from "../script-parser";
import type {
  DependentData,
} from "../script-parser";
import {
  camelKey,
} from "@/utils";

// 生成通用script
export const createCommonScript = (
  preset: IComponentWiki['presets'][number],
  renderProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  curSlot: Record<string, string>,
  isTypeScript: boolean,
  componentName: string,
) => {
  // 依赖列表
  const dependentList: DependentData[] = [];

  if (
    preset &&
    preset?.dependent &&
    preset.dependent?.components &&
    Array.isArray(preset.dependent.components)
  ) {
    // 如果有icon依赖，需要单独处理
    if (preset.dependent?.components?.includes('icon')) {
      // 收集所有slot中的模板内容
      const allTemplates: string[] = [];
      
      // 从renderSlots中获取所有slot的内容
      Object.values(curSlot).forEach(slotContent => {
        if (slotContent) {
          allTemplates.push(slotContent);
        }
      });
      
      // 如果有preset的template，也加入
      if (preset?.template) {
        allTemplates.push(preset.template);
      }
      
      // 合并所有模板内容并提取图标名称
      const combinedTemplate = allTemplates.join('');
      const iconNames = extractIconNames(combinedTemplate);
      
      // 如果找到了图标，添加到依赖列表
      if (iconNames.length > 0) {
        dependentList.push({
          list: iconNames,
          source: ICON_IMPORT_PATH,
        });
      }
    }

    const noIconDependents = preset.dependent.components.filter(item => item !== 'icon');
    dependentList.push({
      list: noIconDependents.map(item => `${toPascalCase(item)} as Bk${toPascalCase(item)}`),
      source: BKUI_PATH,
    });
  }

  let variables = createRefVariables(
    renderProps,
    componentProps,
    isTypeScript,
    componentName,
  );
  if (variables) {
    if (isTypeScript) {
      const curTypeList = [`${toPascalCase(componentName)}Props`];
      dependentList.unshift({
        list: curTypeList,
        source: BKUI_PATH,
        isType: true,
      });
    }
    dependentList.push({
      list: ['ref'],
      source: 'vue',
    });
    variables = `${BREAK_LINE}${variables}${BREAK_LINE}`;
  }
  let importDepend = createDependImport(dependentList);
  if (importDepend.length > 0) {
    importDepend = `${importDepend}${BREAK_LINE}`;
  }

  return `${importDepend}${variables}`;
};

// 根据props生成响应式变量
const createRefVariables = (
  renderProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  isTypeScript: boolean,
  componentName: string,
) => {
  return Object.entries(renderProps).map(([key, value]) => {
    const curPropInfo = componentProps.find(item => item.name === key || camelKey(item.name) === key);
    if (curPropInfo) {
      const curValue = createValue(curPropInfo, value)
      if (isTypeScript) {
        const type = `${toPascalCase(componentName)}Props['${(toPascalCase(key, false))}']`;
        return `const ${camelKey(key)} = ref<${type}>(${curValue});`;
      }
      return `const ${camelKey(key)} = ref(${curValue});`;
    }
    return '';
  })
    .filter(item => item)
    .join(BREAK_LINE);
};

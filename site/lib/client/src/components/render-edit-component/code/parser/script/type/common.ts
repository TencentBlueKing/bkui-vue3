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
  typeForVue,
  handleReservedKeyword,
} from "../../../constant";

import {
  createDependImport,
  createValue,
  parseEvents,
  formatCodeIndent,
  extractTypesFromEventParams,
  collectAllITypes,
} from "../script-parser";


import type {
  DependentData,
} from "../script-parser";
import {
  camelKey,
} from "@/utils";
import {
  isFunctionString,
} from "@/common/util";

// 生成通用script
export const createCommonScript = (
  preset: IComponentWiki['presets'][number],
  renderProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  curSlot: Record<string, string>,
  isTypeScript: boolean,
  componentName: string,
  curEvents: Record<string, string>,
  componentTypes: IComponentWiki['types'],
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

  const { variables, propsFunctionTypes } = createRefVariables(
    renderProps,
    componentProps,
    isTypeScript,
    componentName,
  );
  const eventList = parseEvents(curEvents, isTypeScript);
  const lastLine = eventList.length > 0 ? BREAK_LINE : '';
  
  let finalVariables = variables;
  if (variables) {
    if (isTypeScript) {
      const curTypeList = [`${toPascalCase(componentName)}Props`];
      
      // 收集所有类型（包括events和props中的函数类型）
      const allTypes: string[] = [];
      
      // 1. 从events中收集类型
      if (eventList.length > 0) {
        Object.values(curEvents).forEach(eventValue => {
          const types = extractTypesFromEventParams(eventValue);
          allTypes.push(...types);
        });
      }
      
      // 2. 从props的函数类型中收集类型
      allTypes.push(...propsFunctionTypes);
      
      // 3. linkParams: 匹配当前组件的types
      const allComponentTypes = collectAllITypes(componentTypes);
      const linkParams = allTypes.filter(type => allComponentTypes.includes(type));
      
      // 4. vueParams: 匹配typeForVue
      const vueParams = allTypes.filter(type => typeForVue.includes(type));
      
      // 去重
      const uniqueLinkParams = Array.from(new Set(linkParams));
      const uniqueVueParams = Array.from(new Set(vueParams));
      
      curTypeList.push(...uniqueLinkParams);
      if (uniqueVueParams.length > 0) {
        dependentList.push({
          list: uniqueVueParams,
          source: 'vue',
          isType: true,
        });
      }
      
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
    finalVariables = `${BREAK_LINE}${variables}${BREAK_LINE}`;
  }

  let importDepend = createDependImport(dependentList);
  if (importDepend.length > 0) {
    importDepend = `${importDepend}${BREAK_LINE}`;
  }
  return `${importDepend}${finalVariables}${eventList}${lastLine}`;
};


// 根据props生成响应式变量
const createRefVariables = (
  renderProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  isTypeScript: boolean,
  componentName: string,
) => {
  const propsFunctionTypes: string[] = [];
  
  const variablesList = Object.entries(renderProps).map(([key, value]) => {
    const curPropInfo = componentProps.find(item => item.name === key || camelKey(item.name) === key);
    if (curPropInfo) {
      const curValue = createValue(curPropInfo, value);
      // 处理保留关键字
      const variableName = handleReservedKeyword(camelKey(key));
      
      if (isFunctionString(value)) {
        // 函数类型不用ref包裹，直接使用原始值并格式化
        const formattedValue = formatCodeIndent(value as string, 2, isTypeScript);
        
        // 从函数参数中提取类型
        const types = extractTypesFromEventParams(value as string);
        propsFunctionTypes.push(...types);
        
        return `${BREAK_LINE}const ${variableName} = ${formattedValue}`;
      }

      if (isTypeScript) {
        const type = `${toPascalCase(componentName)}Props['${(toPascalCase(key, false))}']`;
        return `const ${variableName} = ref<${type}>(${curValue});`;
      }
      return `const ${variableName} = ref(${curValue});`;
    }
    return '';
  })
    .filter(item => item);
  
  return {
    variables: variablesList.join(BREAK_LINE),
    propsFunctionTypes,
  };
};

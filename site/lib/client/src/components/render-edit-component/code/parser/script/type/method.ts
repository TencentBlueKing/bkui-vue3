import {
  IComponentWiki,
  ValueType,
} from "@/types/component";
import {
  createDependImport,
  createValue,
  formatCodeIndent,
} from "../script-parser";
import {
  BKUI_PATH,
  BREAK_LINE,
  INDENT,
} from "../../../constant";
import {
  toPascalCase,
} from "../../template/template-parser";

// 生成函数组件script
export const createFunctionScript = (
  curProps: Record<string, ValueType>,
  componentProps: IComponentWiki['props'],
  componentName: string,
) => {
  const propsContent = Object.entries(curProps).map(([key, value]) => {
    const curPropInfo = componentProps.find(item => item.name === key);
    const curValue = createValue(curPropInfo, value);
    return `${key}: ${curValue}`;
  }).join(`,${BREAK_LINE}${INDENT.repeat(2)}`);

  // 依赖列表
  const dependentList = [toPascalCase(componentName)];
  const importDepend = createDependImport([{
    list: dependentList,
    source: BKUI_PATH,
  }]);

  return `${importDepend}${BREAK_LINE}${createMethod(
    componentName,
    propsContent,
  )}`;
};

const createMethod = (componentName: string, propsContent: string) => {
  const method = `const handleShow = () => {
    ${toPascalCase(componentName)}({
      ${propsContent}
    });
  };`
  return formatCodeIndent(method);
};

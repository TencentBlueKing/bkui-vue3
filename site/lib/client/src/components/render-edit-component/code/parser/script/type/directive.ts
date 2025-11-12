import {
  BREAK_LINE,
} from "../../../constant";
import {
  createDependImport,
} from "../script-parser";

// 指令clickoutside特殊处理
export const createClickOutSideScript = () => {
  // 依赖列表
  const dependentList = ['Message'];
  const importDepend = createDependImport([{
    list: dependentList,
    source: 'bkui-vue',
  }]);
  return `${importDepend}${BREAK_LINE}
const handleClickOutside = () => {
  Message({
    message: '点击了外部区域',
    theme: 'primary',
  });
};
`
};
// 换行符
export const BREAK_LINE = '\n';

// 最小缩进单位
export const INDENT = '  ';

// bkui-vue图标导入路径
export const ICON_IMPORT_PATH = 'bkui-vue/lib/icon';

export const BKUI_PATH = 'bkui-vue';

// clickoutside指令
export const clickoutsideDirective = 'clickoutside';
// 指令组件
export const directiveComponents = ['tooltips', 'ellipsis', clickoutsideDirective];
// 函数组件
export const functionComponents = ['notify', 'info-box', 'message'];
// vue内置类型
export const typeForVue = ['ComputedRef', 'ComponentInternalInstance', 'VNode'];

// bk-icon的图标名称
export const iconsName = [
  'AngleDoubleDownLine',
  'AngleDoubleLeft',
  'AngleDoubleLeftLine',
  'AngleDoubleRight',
  'AngleDoubleRightLine',
  'AngleDoubleUpLine',
  'AngleDown',
  'AngleDownFill',
  'AngleDownLine',
  'AngleLeft',
  'AngleRight',
  'AngleUp',
  'AngleUpFill',
  'ArchiveFill',
  'ArrowsLeft',
  'ArrowsRight',
  'Assistant',
  'AudioFill',
  'Bk',
  'Circle',
  'Close',
  'CloseLine',
  'Code',
  'CogShape',
  'CollapseLeft',
  'Copy',
  'CopyShape',
  'DataShape',
  'Del',
  'DocFill',
  'Done',
  'DownShape',
  'DownSmall',
  'EditLine',
  'Ellipsis',
  'EnlargeLine',
  'Error',
  'ExcelFill',
  'ExclamationCircleShape',
  'Eye',
  'FilliscreenLine',
  'FixLine',
  'FixShape',
  'Folder',
  'FolderOpen',
  'FolderShape',
  'FolderShapeOpen',
  'Funnel',
  'GragFill',
  'Help',
  'HelpDocumentFill',
  'HelpFill',
  'ImageFill',
  'ImgError',
  'ImgPlacehoulder',
  'Info',
  'InfoLine',
  'LeftShape',
  'LeftTurnLine',
  'Loading',
  'NarrowLine',
  'Original',
  'PdfFill',
  'PlayShape',
  'Plus',
  'PptFill',
  'Qq',
  'RightShape',
  'RightTurnLine',
  'Search',
  'Share',
  'Spinner',
  'Success',
  'SwitcherLoading',
  'TextAll',
  'TextFile',
  'TextFill',
  'Transfer',
  'TreeApplicationShape',
  'UnfullScreen',
  'Unvisible',
  'UpShape',
  'Upload',
  'VideoFill',
  'Warn',
  'Weixin',
  'WeixinPro'
];

// js保留关键字
export const jsRemainKeyWord = [
  // ES5 保留关键字
  'break',
  'case',
  'catch',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'finally',
  'for',
  'function',
  'if',
  'in',
  'instanceof',
  'new',
  'return',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  
  // ES6+ 新增关键字
  'class',
  'const',
  'enum',
  'export',
  'extends',
  'import',
  'super',
  'let',
  'static',
  'yield',
  'await',
  'async',
  
  // 严格模式下的保留字
  'implements',
  'interface',
  'package',
  'private',
  'protected',
  'public',
  
  // 字面量
  'null',
  'true',
  'false',
  
  // 未来保留字
  'abstract',
  'boolean',
  'byte',
  'char',
  'double',
  'final',
  'float',
  'goto',
  'int',
  'long',
  'native',
  'short',
  'synchronized',
  'throws',
  'transient',
  'volatile'
];

/** 变量名称在碰到js保留关键字时，需要加上的后缀 */
const VARIABLE_AT_JS_REMAIN_KEY_WORD_SUFFIX = 'Method';

// 处理保留关键字的辅助函数
export const handleReservedKeyword = (key: string): string => {
  if (jsRemainKeyWord.includes(key)) {
    return `${key}${VARIABLE_AT_JS_REMAIN_KEY_WORD_SUFFIX}`;
  }
  return key;
};

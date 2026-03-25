import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const OUTPUT_FILE = path.join(ROOT, 'llms-full.txt');

interface PropInfo {
  name: string;
  type: string;
  default: string;
  description: string;
}

interface ComponentInfo {
  name: string;
  pkgName: string;
  category: string;
  navName: string;
  props: PropInfo[];
  emits: string[];
  slots: string[];
  subComponents: string[];
  description: string;
  usage: string;
}

// ─── Component ↔ package mapping ────────────────────────────────────────────
const COMPONENT_PACKAGES: Record<string, string> = {
  Affix: 'affix',
  Alert: 'alert',
  AnimateNumber: 'animate-number',
  Backtop: 'backtop',
  Badge: 'badge',
  Breadcrumb: 'breadcrumb',
  Button: 'button',
  Card: 'card',
  Cascader: 'cascader',
  Checkbox: 'checkbox',
  CodeDiff: 'code-diff',
  Collapse: 'collapse',
  ColorPicker: 'color-picker',
  ConfigProvider: 'config-provider',
  Container: 'container',
  DatePicker: 'date-picker',
  Dialog: 'dialog',
  Divider: 'divider',
  Dropdown: 'dropdown',
  Exception: 'exception',
  FixedNavbar: 'fixed-navbar',
  Form: 'form',
  InfoBox: 'info-box',
  Input: 'input',
  Link: 'link',
  Loading: 'loading',
  Menu: 'menu',
  Message: 'message',
  Modal: 'modal',
  Navigation: 'navigation',
  Notify: 'notify',
  OverflowTitle: 'overflow-title',
  Pagination: 'pagination',
  PopConfirm: 'pop-confirm',
  Popover: 'popover',
  Popover2: 'popover2',
  Process: 'process',
  Progress: 'progress',
  Radio: 'radio',
  Rate: 'rate',
  ResizeLayout: 'resize-layout',
  Scrollbar: 'scrollbar',
  SearchSelect: 'search-select',
  Select: 'select',
  Sideslider: 'sideslider',
  Slider: 'slider',
  Steps: 'steps',
  Swiper: 'swiper',
  Switcher: 'switcher',
  Tab: 'tab',
  Table: 'table',
  Tag: 'tag',
  TagInput: 'tag-input',
  TimePicker: 'time-picker',
  Timeline: 'timeline',
  Transfer: 'transfer',
  Tree: 'tree',
  Upload: 'upload',
  VirtualRender: 'virtual-render',
};

// ─── Category mapping from site router ──────────────────────────────────────
const COMPONENT_CATEGORIES: Record<string, { category: string; navName: string }> = {
  Affix: { category: 'Navigation', navName: 'Affix 图钉' },
  Alert: { category: 'Feedback', navName: 'Alert 警告' },
  AnimateNumber: { category: 'Data', navName: 'AnimateNumber 动画数字' },
  Backtop: { category: 'Navigation', navName: 'BackTop 返回顶部' },
  Badge: { category: 'Data', navName: 'Badge 标记' },
  Breadcrumb: { category: 'Navigation', navName: 'Breadcrumb 面包屑' },
  Button: { category: 'Base', navName: 'Button 基础按钮' },
  Card: { category: 'Feedback', navName: 'Card 卡片' },
  Cascader: { category: 'Form', navName: 'Cascader 级联选择' },
  Checkbox: { category: 'Form', navName: 'Checkbox 多选框' },
  CodeDiff: { category: 'Data', navName: 'Diff 差异对比' },
  Collapse: { category: 'Data', navName: 'Collapse 折叠面板' },
  ColorPicker: { category: 'Navigation', navName: 'ColorPicker 颜色选择器' },
  ConfigProvider: { category: 'Base', navName: 'ConfigProvider 全局配置' },
  Container: { category: 'Layout', navName: 'Grid 栅格' },
  DatePicker: { category: 'Navigation', navName: 'DatePicker 日期选择器' },
  Dialog: { category: 'Feedback', navName: 'Dialog 对话框' },
  Divider: { category: 'Navigation', navName: 'Divider 分割线' },
  Dropdown: { category: 'Data', navName: 'DropdownMenu 下拉菜单' },
  Exception: { category: 'Feedback', navName: 'Exception 异常提示' },
  FixedNavbar: { category: 'Navigation', navName: 'FixedNavbar 悬浮导航' },
  Form: { category: 'Form', navName: 'Form 表单' },
  InfoBox: { category: 'Feedback', navName: 'InfoBox 提示框' },
  Input: { category: 'Form', navName: 'Input 输入框' },
  Link: { category: 'Navigation', navName: 'Link 文字链接' },
  Loading: { category: 'Feedback', navName: 'Loading 加载' },
  Menu: { category: 'Navigation', navName: 'Menu 菜单' },
  Message: { category: 'Feedback', navName: 'Message 消息提示' },
  Modal: { category: 'Feedback', navName: 'Modal 模态框' },
  Navigation: { category: 'Navigation', navName: 'Navigation 导航' },
  Notify: { category: 'Feedback', navName: 'Notify 通知提示' },
  OverflowTitle: { category: 'Feedback', navName: 'OverflowTitle 文本溢出' },
  Pagination: { category: 'Data', navName: 'Pagination 分页' },
  PopConfirm: { category: 'Feedback', navName: 'Popconfirm 弹出确认框' },
  Popover: { category: 'Feedback', navName: 'Popover 弹出框提示' },
  Popover2: { category: 'Feedback', navName: 'Popover2 弹出框提示' },
  Process: { category: 'Navigation', navName: 'Process 步骤' },
  Progress: { category: 'Data', navName: 'Progress 进度条' },
  Radio: { category: 'Form', navName: 'Radio 单选框' },
  Rate: { category: 'Data', navName: 'Rate 评分' },
  ResizeLayout: { category: 'Layout', navName: 'ResizeLayout 可拖拽布局' },
  Scrollbar: { category: 'Base', navName: 'Scrollbar 滚动条' },
  SearchSelect: { category: 'Form', navName: 'SearchSelect 查询选择器' },
  Select: { category: 'Form', navName: 'Select 下拉选框' },
  Sideslider: { category: 'Feedback', navName: 'Sideslider 侧栏' },
  Slider: { category: 'Feedback', navName: 'Slider 滑动选择器' },
  Steps: { category: 'Navigation', navName: 'Steps 步骤' },
  Swiper: { category: 'Data', navName: 'Swiper 轮播图' },
  Switcher: { category: 'Form', navName: 'Switcher 开关' },
  Tab: { category: 'Navigation', navName: 'Tab 选项卡' },
  Table: { category: 'Data', navName: 'Table 表格' },
  Tag: { category: 'Data', navName: 'Tag 标签' },
  TagInput: { category: 'Form', navName: 'TagInput 标签输入' },
  TimePicker: { category: 'Navigation', navName: 'TimePicker 时间选择器' },
  Timeline: { category: 'Navigation', navName: 'Timeline 时间轴' },
  Transfer: { category: 'Feedback', navName: 'Transfer 穿梭框' },
  Tree: { category: 'Data', navName: 'Tree 树' },
  Upload: { category: 'Form', navName: 'Upload 文件上传' },
  VirtualRender: { category: 'Data', navName: 'VirtualRender 虚拟滚动' },
};

// ─── Load metadata supplement ───────────────────────────────────────────────
function loadMeta(): Record<string, any> {
  const metaPath = path.join(__dirname, 'llm-docs-meta.json');
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  }
  return {};
}

// ─── Source file finders ────────────────────────────────────────────────────
function findMainSourceFile(pkgDir: string): string | null {
  const srcDir = path.join(pkgDir, 'src');
  if (!fs.existsSync(srcDir)) return null;

  const files = fs.readdirSync(srcDir);

  // e.g. packages/button/src/button.tsx
  const pkgBase = path.basename(pkgDir);
  const candidates = [
    `${pkgBase}.tsx`,
    `${pkgBase}.ts`,
    'index.tsx',
    'index.ts',
  ];

  for (const c of candidates) {
    if (files.includes(c)) return path.join(srcDir, c);
  }

  const tsxFiles = files.filter(f => f.endsWith('.tsx'));
  if (tsxFiles.length === 1) return path.join(srcDir, tsxFiles[0]);

  return null;
}

function findPropsFile(pkgDir: string): string | null {
  const srcDir = path.join(pkgDir, 'src');
  if (!fs.existsSync(srcDir)) return null;
  const files = fs.readdirSync(srcDir);
  const pkgBase = path.basename(pkgDir);
  const candidates = [
    'props.ts', 'props.tsx', 'props.mixin.ts',
    `${pkgBase}-props.ts`, `tag-props.ts`,
  ];
  for (const f of candidates) {
    if (files.includes(f)) return path.join(srcDir, f);
  }
  // Also find any file with "props" in its name
  const propsFiles = files.filter(f => f.includes('prop') && (f.endsWith('.ts') || f.endsWith('.tsx')));
  if (propsFiles.length > 0) return path.join(srcDir, propsFiles[0]);
  return null;
}

function findAllSourceFiles(pkgDir: string): string[] {
  const srcDir = path.join(pkgDir, 'src');
  if (!fs.existsSync(srcDir)) return [];
  return fs.readdirSync(srcDir)
    .filter(f => (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.endsWith('.d.ts'))
    .map(f => path.join(srcDir, f));
}

// ─── TypeScript AST helpers ─────────────────────────────────────────────────
function parseFile(filePath: string): ts.SourceFile {
  const content = fs.readFileSync(filePath, 'utf-8');
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function nodeText(node: ts.Node, source: ts.SourceFile): string {
  return node.getText(source).trim();
}

function extractPropType(init: ts.Node, source: ts.SourceFile): { type: string; default: string } {
  const text = nodeText(init, source);

  // PropTypes.bool.def(false)
  const defMatch = text.match(/PropTypes\.(\w+)(?:\.\w+)*\.def\(([^)]*)\)/);
  if (defMatch) {
    return { type: mapPropType(defMatch[1]), default: defMatch[2].trim() };
  }

  // PropTypes.bool
  const simpleMatch = text.match(/PropTypes\.(\w+)/);
  if (simpleMatch) {
    return { type: mapPropType(simpleMatch[1]), default: '-' };
  }

  // PropTypes.oneOf([...]).def(...)
  const oneOfDefMatch = text.match(/PropTypes\.oneOf\(\[([^\]]*)\]\)\.def\(([^)]*)\)/);
  if (oneOfDefMatch) {
    return { type: oneOfDefMatch[1].trim(), default: oneOfDefMatch[2].trim() };
  }

  // PropTypes.oneOf([...])
  const oneOfMatch = text.match(/PropTypes\.oneOf\(\[([^\]]*)\]\)/);
  if (oneOfMatch) {
    return { type: oneOfMatch[1].trim(), default: '-' };
  }

  // PropTypes.oneOfType([...])
  const oneOfTypeMatch = text.match(/PropTypes\.oneOfType\(\[([^\]]*)\]\)/);
  if (oneOfTypeMatch) {
    return { type: oneOfTypeMatch[1].replace(/PropTypes\./g, '').trim(), default: '-' };
  }

  // PropTypes.arrayOf(...)
  const arrayOfMatch = text.match(/PropTypes\.arrayOf\(([^)]*)\)/);
  if (arrayOfMatch) {
    return { type: `Array<${arrayOfMatch[1].replace(/PropTypes\./g, '').trim()}>`, default: '-' };
  }

  // { type: String as PropType<...>, default: ... }
  const propTypeMatch = text.match(/type:\s*\w+\s+as\s+PropType<([^>]+)>/);
  const defaultMatch = text.match(/default:\s*([^,}\n]+)/);
  if (propTypeMatch) {
    return {
      type: propTypeMatch[1].trim(),
      default: defaultMatch ? defaultMatch[1].trim() : '-',
    };
  }

  // { type: String, default: ... }
  const simpleTypeMatch = text.match(/type:\s*(\w+)/);
  if (simpleTypeMatch) {
    return {
      type: simpleTypeMatch[1].toLowerCase(),
      default: defaultMatch ? defaultMatch[1].trim() : '-',
    };
  }

  // Function types like TagThemeType().def(...)
  const funcTypeDefMatch = text.match(/(\w+Type)\(\)\.def\(([^)]*)\)/);
  if (funcTypeDefMatch) {
    return { type: funcTypeDefMatch[1], default: funcTypeDefMatch[2].trim() };
  }

  const funcTypeMatch = text.match(/(\w+Type)\(\)/);
  if (funcTypeMatch) {
    return { type: funcTypeMatch[1], default: '-' };
  }

  // Object as PropType<...>
  if (text.includes('PropType<')) {
    const m = text.match(/PropType<([^>]+)>/);
    if (m) return { type: m[1].trim(), default: defaultMatch ? defaultMatch[1].trim() : '-' };
  }

  // func<...>()
  const funcMatch = text.match(/func<([^>]+)>/);
  if (funcMatch) {
    return { type: `Function`, default: '-' };
  }

  return { type: text.slice(0, 60), default: '-' };
}

function mapPropType(t: string): string {
  const map: Record<string, string> = {
    bool: 'Boolean',
    string: 'String',
    number: 'Number',
    func: 'Function',
    array: 'Array',
    object: 'Object',
    any: 'Any',
    symbol: 'Symbol',
  };
  return map[t] || t;
}

// ─── Extract props from an object literal ───────────────────────────────────
function extractPropsFromObject(obj: ts.ObjectLiteralExpression, source: ts.SourceFile, comments: Map<string, string>): PropInfo[] {
  const props: PropInfo[] = [];

  for (const prop of obj.properties) {
    if (ts.isSpreadAssignment(prop)) {
      // e.g. ...propsMixin -- we'll handle externally
      continue;
    }
    if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) continue;

    const name = ts.isPropertyAssignment(prop)
      ? nodeText(prop.name, source)
      : nodeText(prop, source);

    if (ts.isPropertyAssignment(prop)) {
      const { type, default: def } = extractPropType(prop.initializer, source);
      const desc = comments.get(name) || '';
      props.push({ name, type, default: def, description: desc });
    }
  }

  return props;
}

// ─── Extract leading comments for prop names ────────────────────────────────
function extractComments(source: ts.SourceFile): Map<string, string> {
  const result = new Map<string, string>();
  const text = source.getFullText();

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node)) {
      const name = nodeText(node.name, source);
      const ranges = ts.getLeadingCommentRanges(text, node.getFullStart());
      if (ranges?.length) {
        const comment = text.slice(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);
        const cleaned = comment
          .replace(/^\/\/\s*/, '')
          .replace(/^\/\*\*?\s*/, '')
          .replace(/\s*\*\/$/, '')
          .replace(/^\s*\*\s*/gm, '')
          .trim();
        if (cleaned) result.set(name, cleaned);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return result;
}

// ─── Extract emits ──────────────────────────────────────────────────────────
function extractEmits(source: ts.SourceFile): string[] {
  const emits: string[] = [];
  const text = source.getFullText();

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && nodeText(node.name, source) === 'emits') {
      if (ts.isArrayLiteralExpression(node.initializer)) {
        for (const el of node.initializer.elements) {
          if (ts.isStringLiteral(el)) emits.push(el.text);
        }
      } else if (ts.isObjectLiteralExpression(node.initializer)) {
        for (const prop of node.initializer.properties) {
          if (ts.isPropertyAssignment(prop) || ts.isMethodDeclaration(prop)) {
            const name = nodeText(prop.name!, source).replace(/['"]/g, '');
            emits.push(name);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return [...new Set(emits)];
}

// ─── Extract slots heuristically ────────────────────────────────────────────
function extractSlots(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const slots = new Set<string>();

  // this.$slots.xxx or this.$slots.xxx()
  const regex1 = /this\.\$slots\.(\w+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex1.exec(content)) !== null) slots.add(m[1]);

  // slots.xxx?.() or slots.xxx()
  const regex2 = /\bslots\.(\w+)\??\.\(/g;
  while ((m = regex2.exec(content)) !== null) slots.add(m[1]);

  // slots?.xxx
  const regex3 = /\bslots\?\.(\w+)/g;
  while ((m = regex3.exec(content)) !== null) slots.add(m[1]);

  return [...slots];
}

// ─── Extract sub-components from index.ts ───────────────────────────────────
function extractSubComponents(pkgDir: string): string[] {
  const indexPath = path.join(pkgDir, 'src', 'index.ts');
  if (!fs.existsSync(indexPath)) return [];

  const content = fs.readFileSync(indexPath, 'utf-8');
  const subs: string[] = [];

  // withInstallProps(Component, { ButtonGroup, ... })
  const match = content.match(/withInstallProps\(\w+,\s*\{([^}]+)\}/);
  if (match) {
    const inner = match[1];
    const names = inner.match(/\w+/g);
    if (names) subs.push(...names.filter(n => n !== 'Group'));
  }

  return subs;
}

// ─── Collect all top-level object-literal variable declarations ─────────────
function collectVariableObjects(source: ts.SourceFile): Map<string, ts.ObjectLiteralExpression> {
  const map = new Map<string, ts.ObjectLiteralExpression>();

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const name = nodeText(node.name, source);
      if (ts.isObjectLiteralExpression(node.initializer)) {
        map.set(name, node.initializer);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return map;
}

// ─── Resolve the props identifier from `props: someVar` in defineComponent ──
function resolvePropsIdentifier(source: ts.SourceFile): string | null {
  let propsIdent: string | null = null;

  function visit(node: ts.Node) {
    if (propsIdent) return;
    if (ts.isCallExpression(node)) {
      const fnName = nodeText(node.expression, source);
      if (fnName === 'defineComponent' && node.arguments.length > 0) {
        const arg = node.arguments[0];
        if (ts.isObjectLiteralExpression(arg)) {
          for (const prop of arg.properties) {
            if (ts.isPropertyAssignment(prop) && nodeText(prop.name, source) === 'props') {
              if (ts.isIdentifier(prop.initializer)) {
                propsIdent = nodeText(prop.initializer, source);
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return propsIdent;
}

// ─── Extract props from a component's source files ──────────────────────────
function extractComponentProps(pkgDir: string): PropInfo[] {
  let allProps: PropInfo[] = [];

  // Try separate props file first (props.ts, props.mixin.ts)
  const propsFile = findPropsFile(pkgDir);
  if (propsFile) {
    const source = parseFile(propsFile);
    const comments = extractComments(source);
    function visitPropsFile(node: ts.Node) {
      // export default { ... }
      if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
        allProps.push(...extractPropsFromObject(node.expression, source, comments));
      }
      // const props = { ... }
      if (ts.isVariableDeclaration(node) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
        const name = nodeText(node.name, source);
        if (name.toLowerCase().includes('prop') || name.toLowerCase().includes('mixin')) {
          allProps.push(...extractPropsFromObject(node.initializer, source, comments));
        }
      }
      ts.forEachChild(node, visitPropsFile);
    }
    visitPropsFile(source);
  }

  // Also parse the main component file
  const mainFile = findMainSourceFile(pkgDir);
  if (mainFile) {
    const source = parseFile(mainFile);
    const comments = extractComments(source);
    const varObjects = collectVariableObjects(source);

    // First check if defineComponent references a variable for props
    const propsIdent = resolvePropsIdentifier(source);
    if (propsIdent && varObjects.has(propsIdent)) {
      const propsObj = varObjects.get(propsIdent)!;
      const resolved = extractPropsFromObject(propsObj, source, comments);
      const existingNames = new Set(allProps.map(p => p.name));
      for (const p of resolved) {
        if (!existingNames.has(p.name)) allProps.push(p);
      }
    }

    // Also look for inline props: { ... } inside defineComponent
    function visitMain(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        const fnName = nodeText(node.expression, source);
        if (fnName === 'defineComponent' && node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isObjectLiteralExpression(arg)) {
            for (const prop of arg.properties) {
              if (ts.isPropertyAssignment(prop) && nodeText(prop.name, source) === 'props') {
                if (ts.isObjectLiteralExpression(prop.initializer)) {
                  const mainProps = extractPropsFromObject(prop.initializer, source, comments);
                  const existingNames = new Set(allProps.map(p => p.name));
                  for (const p of mainProps) {
                    if (!existingNames.has(p.name)) allProps.push(p);
                  }
                }
              }
            }
          }
        }
      }
      ts.forEachChild(node, visitMain);
    }
    visitMain(source);

    // If still no props found, scan all variables with "prop" or "Type" in the name
    if (allProps.length === 0) {
      for (const [varName, obj] of varObjects) {
        const lower = varName.toLowerCase();
        if (lower.includes('prop') || lower.includes('type') || lower.includes('mixin')) {
          const resolved = extractPropsFromObject(obj, source, comments);
          if (resolved.length > 0) {
            allProps.push(...resolved);
            break;
          }
        }
      }
    }

    // If still 0 props, scan all source files for arrow-function props and default exports
    if (allProps.length === 0) {
      const allFiles = findAllSourceFiles(pkgDir);
      for (const f of allFiles) {
        if (allProps.length > 0) break;
        const src = parseFile(f);
        const cmt = extractComments(src);

        function visitAll(node: ts.Node) {
          // const tagProps = () => ({ ... })
          if (ts.isVariableDeclaration(node) && node.initializer) {
            const vName = nodeText(node.name, src);
            if (vName.toLowerCase().includes('prop')) {
              let body: ts.Expression | undefined;
              if (ts.isArrowFunction(node.initializer) && ts.isParenthesizedExpression(node.initializer.body)) {
                body = (node.initializer.body as ts.ParenthesizedExpression).expression;
              } else if (ts.isArrowFunction(node.initializer) && ts.isObjectLiteralExpression(node.initializer.body)) {
                body = node.initializer.body;
              }
              if (body && ts.isObjectLiteralExpression(body)) {
                allProps.push(...extractPropsFromObject(body, src, cmt));
              }
            }
          }
          // export default { ... }
          if (ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
            const resolved = extractPropsFromObject(node.expression, src, cmt);
            if (resolved.length > 3) {
              allProps.push(...resolved);
            }
          }
          ts.forEachChild(node, visitAll);
        }
        visitAll(src);
      }
    }
  }

  // Deduplicate by name
  const seen = new Set<string>();
  return allProps.filter(p => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

// ─── Process a single component ─────────────────────────────────────────────
function processComponent(name: string, meta: Record<string, any>): ComponentInfo | null {
  const pkgName = COMPONENT_PACKAGES[name];
  if (!pkgName) return null;

  const pkgDir = path.join(PACKAGES_DIR, pkgName);
  if (!fs.existsSync(pkgDir)) return null;

  const catInfo = COMPONENT_CATEGORIES[name] || { category: 'Other', navName: name };
  const componentMeta = meta[name] || {};

  const props = extractComponentProps(pkgDir);

  // Apply description overrides from meta
  if (componentMeta.props) {
    for (const p of props) {
      if (componentMeta.props[p.name]) {
        p.description = componentMeta.props[p.name];
      }
    }
  }

  const mainFile = findMainSourceFile(pkgDir);
  let emits: string[] = [];
  let slots: string[] = [];

  // Scan all source files for emits and slots
  const allSrcFiles = findAllSourceFiles(pkgDir);
  for (const f of allSrcFiles) {
    const source = parseFile(f);
    const fileEmits = extractEmits(source);
    emits.push(...fileEmits);
    slots.push(...extractSlots(f));
  }
  emits = [...new Set(emits)];
  slots = [...new Set(slots)];

  // Merge slot descriptions from meta
  if (componentMeta.slots) {
    for (const s of Object.keys(componentMeta.slots)) {
      if (!slots.includes(s)) slots.push(s);
    }
  }

  const subComponents = extractSubComponents(pkgDir);

  return {
    name,
    pkgName,
    category: catInfo.category,
    navName: catInfo.navName,
    props,
    emits,
    slots,
    subComponents,
    description: componentMeta.description || '',
    usage: componentMeta.usage || '',
  };
}

// ─── Output formatters ──────────────────────────────────────────────────────
function formatPropsTable(props: PropInfo[]): string {
  if (props.length === 0) return 'No props.\n';
  const lines = [
    '| Name | Type | Default | Description |',
    '| --- | --- | --- | --- |',
  ];
  for (const p of props) {
    const desc = p.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const def = p.default.replace(/\|/g, '\\|');
    const type = p.type.replace(/\|/g, '\\|');
    lines.push(`| ${p.name} | ${type} | ${def} | ${desc} |`);
  }
  return lines.join('\n') + '\n';
}

function formatEmitsTable(emits: string[]): string {
  if (emits.length === 0) return 'No events.\n';
  const lines = [
    '| Event Name | Description |',
    '| --- | --- |',
  ];
  for (const e of emits) {
    lines.push(`| ${e} | - |`);
  }
  return lines.join('\n') + '\n';
}

function formatSlotsTable(slots: string[], meta?: Record<string, string>): string {
  if (slots.length === 0) return 'No slots.\n';
  const lines = [
    '| Slot Name | Description |',
    '| --- | --- |',
  ];
  for (const s of slots) {
    const desc = meta?.[s] || '-';
    lines.push(`| ${s} | ${desc} |`);
  }
  return lines.join('\n') + '\n';
}

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main() {
  const meta = loadMeta();
  const componentNames = Object.keys(COMPONENT_PACKAGES);
  const components: ComponentInfo[] = [];

  console.log(`Processing ${componentNames.length} components...`);

  for (const name of componentNames) {
    const info = processComponent(name, meta);
    if (info) {
      components.push(info);
      console.log(`  [OK] ${name} — ${info.props.length} props, ${info.emits.length} emits, ${info.slots.length} slots`);
    } else {
      console.log(`  [SKIP] ${name}`);
    }
  }

  // Group by category
  const categories = new Map<string, ComponentInfo[]>();
  for (const c of components) {
    const list = categories.get(c.category) || [];
    list.push(c);
    categories.set(c.category, list);
  }

  const categoryOrder = ['Base', 'Layout', 'Navigation', 'Form', 'Data', 'Feedback', 'Other'];

  // ─── Build output ───────────────────────────────────────────────────────
  const out: string[] = [];

  out.push(`# bkui-vue Component Library — LLM Reference Documentation`);
  out.push('');
  out.push('This document provides a complete API reference for the bkui-vue component library (BlueKing UI Vue3).');
  out.push('It is designed to be consumed by AI agents and LLMs for accurate code generation and assistance.');
  out.push('');

  // Overview section
  out.push('## Overview');
  out.push('');
  out.push('bkui-vue is an enterprise-grade Vue 3 component library developed by Tencent BlueKing.');
  out.push('It provides 59+ UI components for building modern web applications.');
  out.push('');
  out.push('- **Package name**: `bkui-vue`');
  out.push('- **Vue compatibility**: Vue 3.2+');
  out.push('- **License**: MIT');
  out.push('');

  // Installation
  out.push('## Installation');
  out.push('');
  out.push('```bash');
  out.push('npm install bkui-vue');
  out.push('```');
  out.push('');
  out.push('### Peer Dependencies');
  out.push('');
  out.push('- `vue` ^3.2.0');
  out.push('- `highlight.js` ~11.5.0 (optional, for code highlighting)');
  out.push('');

  // Global usage
  out.push('## Usage');
  out.push('');
  out.push('### Full Import');
  out.push('');
  out.push('```typescript');
  out.push("import BkuiVue from 'bkui-vue';");
  out.push("import 'bkui-vue/dist/style.css';");
  out.push('');
  out.push('const app = createApp(App);');
  out.push('app.use(BkuiVue);');
  out.push('```');
  out.push('');
  out.push('### On-Demand Import');
  out.push('');
  out.push('```typescript');
  out.push("import { Button, Select, Table } from 'bkui-vue';");
  out.push('```');
  out.push('');
  out.push('### Component Naming Convention');
  out.push('');
  out.push('All components are registered with a `Bk` prefix when using global registration.');
  out.push('For example, `Button` becomes `<bk-button>`, `Select` becomes `<bk-select>`, etc.');
  out.push('When importing on-demand, use the PascalCase name directly: `<Button>`, `<Select>`, etc.');
  out.push('');

  // Hooks
  out.push('## Hooks');
  out.push('');
  out.push('bkui-vue exports the following hooks:');
  out.push('');
  out.push('- `useGlobalConfig` — Access global configuration');
  out.push('- `provideGlobalConfig` — Provide global configuration');
  out.push('- `useLocale` — Access locale/i18n');
  out.push('- `usePrefix` — Access CSS class name prefix (for theming)');
  out.push('- `defaultRootConfig` — Default root configuration object');
  out.push('- `rootProviderKey` — Injection key for root config');
  out.push('');

  // Component catalog
  out.push('## Component Catalog');
  out.push('');

  for (const cat of categoryOrder) {
    const list = categories.get(cat);
    if (!list || list.length === 0) continue;
    out.push(`### ${cat}`);
    out.push('');
    out.push('| Component | Tag Name | Description |');
    out.push('| --- | --- | --- |');
    for (const c of list) {
      const tag = `<bk-${kebabCase(c.name)}>`;
      out.push(`| ${c.name} | \`${tag}\` | ${c.description || c.navName} |`);
    }
    out.push('');
  }

  // Per-component documentation
  out.push('---');
  out.push('');
  out.push('## Component API Reference');
  out.push('');

  for (const cat of categoryOrder) {
    const list = categories.get(cat);
    if (!list || list.length === 0) continue;

    for (const c of list) {
      const tag = `bk-${kebabCase(c.name)}`;

      out.push(`### ${c.name}`);
      out.push('');
      if (c.description) {
        out.push(c.description);
        out.push('');
      }
      out.push(`- **Tag**: \`<${tag}>\``);
      out.push(`- **Import**: \`import { ${c.name} } from 'bkui-vue'\``);
      out.push(`- **Package**: \`@bkui-vue/${c.pkgName}\``);
      out.push(`- **Category**: ${c.category}`);
      if (c.subComponents.length > 0) {
        out.push(`- **Sub-components**: ${c.subComponents.join(', ')}`);
      }
      out.push('');

      // Usage example
      if (c.usage) {
        out.push('#### Usage');
        out.push('');
        out.push('```vue');
        out.push(c.usage);
        out.push('```');
        out.push('');
      }

      // Props
      out.push('#### Props');
      out.push('');
      out.push(formatPropsTable(c.props));

      // Events
      out.push('#### Events');
      out.push('');
      out.push(formatEmitsTable(c.emits));

      // Slots
      const slotMeta = (meta[c.name]?.slots as Record<string, string>) || {};
      out.push('#### Slots');
      out.push('');
      out.push(formatSlotsTable(c.slots, slotMeta));

      out.push('---');
      out.push('');
    }
  }

  // Directives
  out.push('## Directives');
  out.push('');
  out.push('bkui-vue provides the following directives:');
  out.push('');
  out.push('- `v-bk-clickoutside` — Detect clicks outside an element');
  out.push('- `v-bk-tooltips` — Attach tooltip to an element');
  out.push('- `v-bk-loading` — Show loading state on an element');
  out.push('- `v-bk-overflow-title` — Show tooltip when text overflows');
  out.push('');

  // Write output
  const content = out.join('\n');
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`\nGenerated ${OUTPUT_FILE} (${(content.length / 1024).toFixed(1)} KB, ${components.length} components)`);
}

main();

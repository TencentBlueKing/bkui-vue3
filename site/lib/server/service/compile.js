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
import path from 'node:path';
import {
  buildModule
} from '@blueking/cli-service/dist/tools/rust/module/index.js';
import {
  transform
} from '@blueking/cli-service/dist/tools/rust/transform/index.js';
import {
  emit
} from '@blueking/cli-service/dist/tools/rust/emit/index.js';
import LessResolvePathPlugin from '../scripts/less-plugin.js';

// 组件公共依赖
const externals = {
  vue: 'vue',
  lodash: 'lodash',
  uuid: 'uuid',
  'lodash/throttle': 'lodashThrottle',
  'lodash/merge': 'lodashMerge',
  '@popperjs/core': 'popperjsCore',
  'vue-types': 'vueTypes'
}

/**
 * 生成函数名（基于文件路径）
 * @param {*} absolutePath 文件绝对路径
 * @param {*} releaseZipPath zip 地址
 * @returns 函数名
 */
const generateFunctionName = (absolutePath, releaseZipPath) => {
  return absolutePath
    .replace(releaseZipPath, '')
    .replace(/[-//.]/g, '_')
};

/**
 * 获取依赖的绝对路径
 * @param {*} originAbsoluteFilePath 文件初始绝对地址
 * @param {*} dependencyPath 依赖地址
 * @returns 依赖的绝对地址
 */
const getDependencyAbsolutePath = (originAbsoluteFilePath, dependencyPath) => {
  if (externals[dependencyPath]) {
    return externals[dependencyPath]; // 如果是外部依赖，直接返回
  }
  // 处理相对路径
  const originAbsoluteDir = path.dirname(originAbsoluteFilePath);
  return path.resolve(originAbsoluteDir, dependencyPath)
};

/**
 * 核心转换函数
 * @param {*} code 文件内容
 * @param {*} originAbsoluteFilePath 原始文件绝对地址
 * @param {*} releaseZipPath zip 地址
 * @returns 转换后的文件内容
 */
// const transformFileContent = (code, originAbsoluteFilePath, releaseZipPath) => {
//   // 去除注释
//   let transformedCode = code
//     .replace(/\/\*[\s\S]*?\*\/|([^\:]|^)\/\/.*$/gm, '$1');
  
//   // 移除 export type 语句（TypeScript 类型导出）
//   transformedCode = transformedCode.replace(/export\s+type\s*\{[^}]*\};?/g, '');

//   const importedPaths = new Map();
//   const exportsMap = new Map(); // key=导出名, value=本地变量名
//   const reExportedPaths = []; // 用于跟踪 export * from
//   let hasDefaultExport = false;
//   const defaultExportName = '_default';

//   // 处理 export * from 语句
//   transformedCode = transformedCode.replace(
//     /export\s+\*\s+from\s+['"](.*?)['"];?/g,
//     (match, dependencyPath) => {
//       if (!dependencyPath) return match;
      
//       const funcName = generateFunctionName(getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath), releaseZipPath);
//       reExportedPaths.push(funcName);
//       importedPaths.set(dependencyPath, funcName);
      
//       return `const _reexport_${funcName} = ${funcName}();`;
//     }
//   );

//   // 处理默认 import 语句（import Component from './path'）
//   transformedCode = transformedCode.replace(
//     /import\s+(\w+)\s+from\s+['"](.*?)['"];?/g,
//     (match, defaultName, dependencyPath) => {
//       if (!dependencyPath) return match;
      
//       const funcName = generateFunctionName(getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath), releaseZipPath);
//       importedPaths.set(dependencyPath, funcName);
      
//       return `const ${defaultName} = ${funcName}().default || ${funcName}();`;
//     }
//   );

//   // 处理具名 import 语句（import { ... } from './path'），支持as重命名
//   transformedCode = transformedCode.replace(
//     /import\s*\{([^}]+)\}\s*from\s+['"](.*?)['"];?/g,
//     (match, imports, dependencyPath) => {
//       if (!dependencyPath) return match;
      
//       const funcName = generateFunctionName(getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath), releaseZipPath);
//       importedPaths.set(dependencyPath, funcName);
      
//       // 解析导入项，支持as语法
//       const importItems = imports.split(',').map(item => item.trim());
//       const transformedImports = importItems.map(item => {
//         if (item.includes(' as ')) {
//           const [original, alias] = item.split(/\s+as\s+/);
//           return `${original}: ${alias}`;
//         }
//         return item;
//       }).join(', ');
      
//       return `const { ${transformedImports} } = ${funcName}();`;
//     }
//   );

//   // 处理 export { ... } from 'path' 语句 - 核心修复
//   transformedCode = transformedCode.replace(
//     /export\s*\{([^}]+)\}\s*from\s*['"](.*?)['"];?/g,
//     (match, exports, dependencyPath) => {
//       if (!dependencyPath) return match;
      
//       const funcName = generateFunctionName(getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath), releaseZipPath);
//       importedPaths.set(dependencyPath, funcName);
      
//       // 解析导出项，支持as语法
//       const exportItems = exports.split(',').map(e => e.trim()).filter(Boolean);
      
//       // 为每个导出项生成变量声明
//       const declarations = exportItems.map(item => {
//         if (item.includes(' as ')) {
//           const [original, alias] = item.split(/\s+as\s+/);
//           // 处理 default as 导出
//           if (original === 'default') {
//             exportsMap.set(alias, alias);
//             return `const ${alias} = ${funcName}().default;`;
//           } else {
//             exportsMap.set(alias, alias);
//             return `const ${alias} = ${funcName}().${original};`;
//           }
//         } else {
//           // 处理默认导出
//           if (item === 'default') {
//             exportsMap.set(item, item);
//             return `const ${item} = ${funcName}().default;`;
//           } else {
//             exportsMap.set(item, item);
//             return `const ${item} = ${funcName}().${item};`;
//           }
//         }
//       });
      
//       return declarations.join('\n');
//     }
//   );

//   // 处理 export 语句 - 变量声明
//   transformedCode = transformedCode.replace(
//     /export\s+(const|let|var)\s+(\w+)/g,
//     (match, keyword, name) => {
//       exportsMap.set(name, name);
//       return `${keyword} ${name}`;
//     }
//   );

//   // 处理 export 语句 - 函数声明
//   transformedCode = transformedCode.replace(
//     /export\s+function\s+(\w+)/g,
//     (match, name) => {
//       exportsMap.set(name, name);
//       return `function ${name}`;
//     }
//   );

//   // 处理 export 语句 - 类声明
//   transformedCode = transformedCode.replace(
//     /export\s+class\s+(\w+)/g,
//     (match, name) => {
//       exportsMap.set(name, name);
//       return `class ${name}`;
//     }
//   );

//   // 处理具名导出（支持as重命名）
//   transformedCode = transformedCode.replace(
//     /export\s*\{([^}]+)\};?/g,
//     (match, exports) => {
//       const exportItems = exports.split(',').map(e => e.trim()).filter(Boolean);
      
//       exportItems.forEach(item => {
//         if (item.includes(' as ')) {
//           const [local, exported] = item.split(/\s+as\s+/);
//           exportsMap.set(exported, local);
//         } else {
//           exportsMap.set(item, item);
//         }
//       });
      
//       return '';
//     }
//   );

//   // 处理默认导出
//   transformedCode = transformedCode.replace(
//     /export\s+default\s+([\s\S]+?)(;?)(\s*)$/gm,
//     (match, value, semicolon, whitespace) => {
//       hasDefaultExport = true;
//       return `const ${defaultExportName} = ${value.trim()}${semicolon}${whitespace}`;
//     }
//   );

//   // 添加 return 语句
//   let returnItems = [];
  
//   // 添加具名导出 - 使用属性简写语法
//   exportsMap.forEach((localName, exportedName) => {
//     if (localName === exportedName) {
//       returnItems.push(`  ${exportedName}`);
//     } else {
//       returnItems.push(`  ${exportedName}: ${localName}`);
//     }
//   });
  
//   // 处理 export * from 的重新导出
//   reExportedPaths.forEach(funcName => {
//     returnItems.push(`  ..._reexport_${funcName}`);
//   });
  
//   // 添加默认导出
//   if (hasDefaultExport) {
//     returnItems.push(`  default: ${defaultExportName}`);
//   }
  
//   if (returnItems.length > 0 || reExportedPaths.length > 0) {
//     transformedCode += `\n\nreturn {\n${returnItems.join(',\n')}\n};`;
//   } else {
//     transformedCode += `\n\nreturn {};`;
//   }

//   return transformedCode
// }
const transformFileContent = (code, originAbsoluteFilePath, releaseZipPath) => {
  // 去除注释
  let transformedCode = code
    .replace(/\/\*[\s\S]*?\*\/|([^\:]|^)\/\/.*$/gm, '$1');

  transformedCode = transformedCode.replace(/"use strict";/g, 'const exports = {}');

  transformedCode = transformedCode.replace(
    /require\(['"](.*?)['"]\);?/g,
    (match, dependencyPath) => {
      if (!dependencyPath) return match;
      const funcName = generateFunctionName(getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath), releaseZipPath);
      return `${funcName}()`;
    }
  );

  transformedCode += 'return exports';

  return transformedCode;
}

/**
 * 获取编译上下文
 * @param {*} releaseZipPath zip 路径
 * @param {*} entryPath 入口文件路径
 * @returns context
 */
const getCompileContext = (releaseZipPath, entryPath, preserveModuleType, options = {}) => {
  return {
    workDir: releaseZipPath,
    options: {
      ...options,
      preserveModuleType,
      resource: {
        main: {
          entry: entryPath
        }
      },
      configureWebpack: {
        ...options?.configureWebpack,
        resolve: {
          alias: {
            '@bkui-vue': releaseZipPath
          }
        }
      },
    }
  }
}

/**
 * @description 编译demo文件
 */
export const compileDemo = async (releaseZipPath, entryPath) => {
  const fileMap = {};
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs');
  await buildModule(fileMap, context);
  await transform(fileMap, context);
  await emit(fileMap, context);
}

/**
 * 构造编译后的文件
 * @param {*} fileMap 文件map
 * @param {*} entryPath 入口文件地址
 */
export const generateCompiledFile = async (fileMap, entryPath, releaseZipPath) => {
  const entryFile = fileMap[entryPath]
  const transformedEntryFileContent = transformFileContent(entryFile.content, entryFile.originAbsoluteFilePath, releaseZipPath);
  const transformedDependenciesContent = Object.values(fileMap).reduce(
    (acc, cur) => {
      if (cur.originAbsoluteFilePath !== entryPath) {
        acc += `function ${generateFunctionName(cur.outputAbsoluteFilePath, releaseZipPath)}() {
        ${transformFileContent(cur.content, cur.originAbsoluteFilePath, releaseZipPath)}
        }\n`;
      }
      return acc;
    },
    ''
  );
  return `window.getComponent = () => {\n${transformedDependenciesContent}\n${transformedEntryFileContent}\n}`;
}

/**
 * @description 编译组件文件
 */
export const compileComponent = async (releaseZipPath, component) => {
  // 组件文件
  const fileMap = {};
  // 构建配置
  const options = {
    configureWebpack: {
      externals
    }
  }
  // 路径
  const entryPath = path.resolve(releaseZipPath, component, 'src/index.ts')
  // 生成上下文
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  // 编辑
  await buildModule(fileMap, context);
  // 转换
  await transform(fileMap, context);
  // 输出，减少二次编译
  await emit(fileMap, context);
  // 生成组件文件
  return generateCompiledFile(fileMap, entryPath, releaseZipPath);
}

/**
 * 编译组件css
 * @param {*} releaseZipPath zip包路径
 * @param {*} component 组件名
 * @returns 
 */
export const compileCss = async (releaseZipPath, component) => {
  // 组件文件
  const fileMap = {};
  // 路径
  const entryPath = path.resolve(releaseZipPath, component, `src/${component}.less`);
  // 构建配置
  const options = {
    configureWebpack: {
      externals: {
        '@bkui-vue/styles': path.resolve(releaseZipPath, 'styles/src'),
      },
    },
    css: {
      lessLoaderOptions: {
        plugins: [new LessResolvePathPlugin()]
      }
    }
  };
  // 生成上下文
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  // 编辑
  await buildModule(fileMap, context);
  // 转换
  await transform(fileMap, context);
  // 输出，减少二次编译
  await emit(fileMap, context);
  
  return fileMap[entryPath].content;
}

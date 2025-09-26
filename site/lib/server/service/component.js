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
import AdmZip from 'adm-zip';
import fs from 'node:fs';
import path from 'node:path';

import {
  COMPILE_CSS_FILE,
  COMPILE_JS_FILE,
  RELEASE_DIR,
  RELEASE_DIST_DIR,
} from '../common';
import http from '../util/http';

import {
  compileComponent,
  compileCss,
  compileDemo,
} from './compile';

// 彻底清除模块缓存的函数
const clearModuleCache = (modulePath) => {
  try {
    const resolvedPath = require.resolve(modulePath);

    // 递归清除依赖模块的缓存
    const clearDependencies = (targetPath) => {
      const module = require.cache[targetPath];
      if (module) {
        // 清除该模块依赖的其他模块缓存
        if (module.children) {
          module.children.forEach((child) => {
            // 只清除项目内部的模块，避免清除node_modules中的模块
            if (child.filename && !child.filename.includes('node_modules')) {
              clearDependencies(child.filename);
            }
          });
        }
        // 删除当前模块缓存
        delete require.cache[targetPath];
      }
    };

    clearDependencies(resolvedPath);
  } catch (error) {
    // 如果模块不存在或解析失败，直接删除可能存在的缓存
    delete require.cache[modulePath];
    console.warn(`清除模块缓存时出现警告: ${error.message}`);
  }
};

// 获取编译文件路径
const getDistFilePath = (version, component, file) => {
  const dir = path.resolve(RELEASE_DIST_DIR, `${version}`, component, 'src');
  // 创建目录
  fs.mkdirSync(dir, { recursive: true });
  return path.resolve(dir, file);
};

// 获取组件版本列表
export const getVersions = async () => {
  const releases = await http.get('https://api.github.com/repos/TencentBlueKing/bkui-vue3/releases');
  const versions = releases.map(release => release.tag_name);
  if (process.env.NODE_ENV === 'development') {
    versions.push('dev');
  }
  return versions;
};

// 获取文件作者列表
export const getFileAuthors = async (path) => {
  const commits = await http.get('https://api.github.com/repos/TencentBlueKing/bkui-vue3/commits', {
    params: {
      path,
    },
  });
  return commits.map(commit => ({
    login: commit.author.login,
    avatar: commit.author.avatar_url,
    timestamp: commit.commit.author.date,
  }));
};

// 获取组件
export const getComponent = async (releaseZipPath, component, version) => {
  // 编译后的 js 文件路径
  const compiledJsPath = getDistFilePath(version, component, COMPILE_JS_FILE);

  // 如果编译后的 js 文件不存在，则编译组件
  if (!fs.existsSync(compiledJsPath)) {
    // 编译组件
    const compiledComponent = await compileComponent(releaseZipPath, component);
    // 写入文件
    fs.writeFileSync(compiledJsPath, compiledComponent, 'utf-8');
  }
  return fs.readFileSync(compiledJsPath);
};

// 获取组件 CSS
export const getCss = async (releaseZipPath, component, version) => {
  // 编译后的 css 文件路径
  const compiledCssPath = getDistFilePath(version, component, COMPILE_CSS_FILE);

  // 如果编译后的 css 文件不存在，则编译组件
  if (!fs.existsSync(compiledCssPath)) {
    const compiledCss = await compileCss(releaseZipPath, component);
    // 写入文件
    fs.writeFileSync(compiledCssPath, compiledCss, 'utf-8');
  }
  return fs.readFileSync(compiledCssPath, 'utf-8');
};

// 获取 NavGroups
export const getNavGroups = async (releaseZipPath) => {
  // 获取组件列表
  const componentGroupMap = {};
  const componentPaths = fs.readdirSync(releaseZipPath);
  for (const componentPath of componentPaths) {
    const componentDemoPath = path.resolve(
      releaseZipPath,
      componentPath,
      'demo/index.ts',
    );
    if (fs.existsSync(componentDemoPath)) {
      // 编译 demo 文件
      const componentCompiledDemoPath = path.resolve(
        releaseZipPath,
        componentPath,
        'demo/index.ts.js',
      );
      if (!fs.existsSync(componentCompiledDemoPath)) {
        await compileDemo(releaseZipPath, componentDemoPath);
      }
      // dev 模式下 - 彻底清除模块缓存
      if (process.env.NODE_ENV === 'development') {
        clearModuleCache(componentCompiledDemoPath);
      }
      const { default: demo } = require(componentCompiledDemoPath);
      componentGroupMap[demo.group] = componentGroupMap[demo.group] || [];
      componentGroupMap[demo.group].push(demo);
    }
  }

  return {
    componentGroupMap,
  };
};

// 获取组件 release zip 包路径
export const getReleaseZipPath = async (version) => {
  const releaseZipPath = path.resolve(RELEASE_DIR, `${version}`);
  // 如果不存在，则下载
  if (!fs.existsSync(releaseZipPath)) {
    if (version === 'dev') {
      // dev 直接复制源码
      const sourcePath = path.resolve(__dirname, '../../../../packages');
      fs.cpSync(sourcePath, releaseZipPath, {
        recursive: true,
        force: true,
      });
    } else {
      // 其他版本下载 zip 包
      const zipballUrl = `https://api.github.com/repos/TencentBlueKing/bkui-vue3/zipball/${version}`;
      const response = await http.get(zipballUrl, {
        responseType: 'arraybuffer',
      });
      // unzip
      const tempPath = path.resolve(__dirname, `${RELEASE_DIR}/${version}-temp`);
      const unzip = new AdmZip(Buffer.from(response));
      unzip.extractAllTo(tempPath, true);
      // 去除一级目录
      const entries = fs.readdirSync(tempPath);
      entries.forEach((entry) => {
        const entryPath = path.resolve(tempPath, entry);
        fs.renameSync(entryPath, releaseZipPath);
      });
      fs.rmdirSync(tempPath);
    }
  }
  return releaseZipPath;
};

export const deleteReleaseZip = async (version) => {
  const releaseZipPath = path.resolve(RELEASE_DIR, `${version}`);
  if (fs.existsSync(releaseZipPath)) {
    fs.rmSync(releaseZipPath, { recursive: true, force: true });
  }
};

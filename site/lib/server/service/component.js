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
const getDistFilePath = (version, component, type, file) => {
  const dir = type === 'directive'
    ? path.resolve(RELEASE_DIST_DIR, `${version}`, 'directives', 'src', `${component}.js`)
    : path.resolve(RELEASE_DIST_DIR, `${version}`, component, 'src');
  // 创建目录
  fs.mkdirSync(dir, { recursive: true });
  return path.resolve(dir, file);
};

// 获取组件版本列表
export const getVersions = async () => {
  // 读取 RELEASE_DIR 目录下的外层目录
  const versions = fs.readdirSync(RELEASE_DIR);
  if (process.env.NODE_ENV === 'development' && !versions.includes('dev')) {
    versions.push('dev');
  }
  return versions;
};

// 获取设计规范
export const getDesign = async (name) => {
  const { data } = await http.get(`${process.env.BK_DESIGN_URL}/api/article`);
  const article = data.find(item => {
    return item.content?.includes(`{{vue3:${name}}}`) || item.name.toLowerCase().includes(name.toLowerCase());
  });
  // 去掉第一个#和第二个## 之间的内容
  return article?.content.replace(/^#(?!#)[\s\S]*?(?=##)/m, '');
};

// 获取文件作者列表
export const getFileAuthors = async (path) => {
  try {
    // 准备请求头
    const headers = {};
    
    // 如果配置了 GitHub Token，则添加认证头
    if (process.env.BK_GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.BK_GITHUB_TOKEN}`;
    } else {
      console.warn('⚠️  未配置 GITHUB_TOKEN，使用未认证请求（速率限制：60次/小时）');
    }

    const commits = await http.get('https://api.github.com/repos/TencentBlueKing/bkui-vue3/commits', {
      params: {
        path,
      },
      headers,
    });
    
    // 增加错误处理
    if (!Array.isArray(commits)) {
      console.error('GitHub API 返回数据格式异常');
      return [];
    }
    
    // 去重 && 去除空数据
    return commits.reduce(
      (acc, cur) => {
        if (cur.author?.login && acc.findIndex(item => item.login === cur.author.login) < 0) {
          acc.push({
            login: cur.author.login,
            avatar: cur.author.avatar_url,
          });
        }
        return acc;
      },
      []
    )
  } catch (error) {
    console.error('获取文件作者失败:', error.message);
    if (error.response?.status === 403) {
      console.error('❌ GitHub API 速率限制！请配置 GITHUB_TOKEN 或等待限制重置');
    }
    return [];
  }
};

// 获取组件
export const getComponent = async (releaseZipPath, component, version, type) => {
  // 编译后的 js 文件路径
  const compiledJsPath = getDistFilePath(version, component, type, COMPILE_JS_FILE);

  // 如果编译后的 js 文件不存在，则编译组件
  if (!fs.existsSync(compiledJsPath)) {
    // 编译组件
    const compiledComponent = await compileComponent(releaseZipPath, component, type);
    // 写入文件
    fs.writeFileSync(compiledJsPath, compiledComponent, 'utf-8');
  }
  return fs.readFileSync(compiledJsPath);
};

// 获取组件 CSS
export const getCss = async (releaseZipPath, component, version, type) => {
  // 编译后的 css 文件路径
  const compiledCssPath = getDistFilePath(version, component, type, COMPILE_CSS_FILE);

  // 如果编译后的 css 文件不存在，则编译组件
  if (!fs.existsSync(compiledCssPath)) {
    const compiledCss = await compileCss(releaseZipPath, component, type);
    // 写入文件
    fs.writeFileSync(compiledCssPath, compiledCss, 'utf-8');
  }
  return fs.readFileSync(compiledCssPath, 'utf-8');
};

// 获取 NavGroups
export const getNavGroups = async (releaseZipPath) => {
  const version = path.basename(releaseZipPath);
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
        RELEASE_DIST_DIR,
        `${version}`,
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
  // 获取指令列表
  const directiveList = [];
  const directiveListPaths = fs.readdirSync(path.resolve(releaseZipPath, 'directives/demo'));
  for (const directivePath of directiveListPaths) {
    const directiveDemoPath = path.resolve(releaseZipPath, 'directives/demo', directivePath);
    if (fs.existsSync(directiveDemoPath)) {
      const directiveCompiledDemoPath = path.resolve(RELEASE_DIST_DIR, `${version}`, 'directives', 'demo', `${directivePath}.js`);
      if (!fs.existsSync(directiveCompiledDemoPath)) {
        await compileDemo(releaseZipPath, directiveDemoPath);
      }
      // dev 模式下 - 彻底清除模块缓存
      if (process.env.NODE_ENV === 'development') {
        clearModuleCache(directiveCompiledDemoPath);
      }
      const { default: directive } = require(directiveCompiledDemoPath);
      directiveList.push(directive);
    }
  }
  // 获取自定义组件列表
  const customComponentList = [
    {
      name: '@blueking/date-picker',
      title: 'DatePicker',
      titleCN: '时间选择器',
    },
    {
      name: '@blueking/log-search',
      title: 'LogSearch',
      titleCN: '日志检索',
    },
    {
      name: '@blueking/functional-dependency',
      title: 'FunctionalDeps',
      titleCN: '功能依赖展示',
    },
    {
      name: '@blueking/ediatable',
      title: 'Ediatable',
      titleCN: '可编辑表格',
    },
    {
      name: '@blueking/release-note',
      title: 'ReleaseNote',
      titleCN: '版本日志',
    },
    {
      name: '@blueking/crontab',
      title: 'Cronatb',
      titleCN: '周期选择器',
    },
  ];

  return {
    componentGroupMap,
    directiveList,
    customComponentList,
  };
};

// 获取组件 release zip 包路径
export const getReleaseZipPath = async (version) => {
  const releaseZipPath = path.resolve(RELEASE_DIR, `${version}`);
  // 如果不存在，则下载
  if (version === 'dev' && !fs.existsSync(releaseZipPath)) {
    // dev 直接复制源码
    const sourcePath = path.resolve(__dirname, '../../../../packages');
    fs.cpSync(sourcePath, releaseZipPath, {
      recursive: true,
      force: true,
    });
  }
  return releaseZipPath;
};

// 清空构建目录
export const deleteReleaseZip = (version) => {
  const releasePath = path.resolve(RELEASE_DIR, `${version}`);
  const releaseDistPath = path.resolve(RELEASE_DIST_DIR, `${version}`);
  fs.rmSync(releasePath, { recursive: true, force: true })
  fs.rmSync(releaseDistPath, { recursive: true, force: true })
}

// 获取 npm 包 markdown 内容
export const getNpmMarkdown = async (name) => {
  const os = require('os');
  const https = require('https');
  const tar = require('tar');
  
  try {
    // 1. 获取包信息，找到 tarball URL
    const packageInfo = await http.get(`https://registry.npmjs.org/${name}/latest`);
    const tarballUrl = packageInfo.dist?.tarball;

    // 2. 创建临时目录
    const tempDir = path.join(os.tmpdir(), `npm-${name.replace(/\//g, '-')}-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    try {
      // 3. 下载并解压 tarball（使用原生 https 模块获取 stream）
      await new Promise((resolve, reject) => {
        https.get(tarballUrl, (response) => {
          // 处理重定向
          if (response.statusCode === 301 || response.statusCode === 302) {
            https.get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(
                tar.extract({
                  cwd: tempDir,
                  strip: 1, // 去掉 package/ 前缀
                })
              ).on('finish', resolve).on('error', reject);
            }).on('error', reject);
          } else {
            response.pipe(
              tar.extract({
                cwd: tempDir,
                strip: 1,
              })
            ).on('finish', resolve).on('error', reject);
          }
        }).on('error', reject);
      });

      // 4. 查找根目录的 .md 文件
      const files = fs.readdirSync(tempDir);
      const markdownFiles = files.filter(file => {
        const lower = file.toLowerCase();
        return lower.endsWith('.md');
      });
      
      // 优先查找 README.md，然后是其他 .md 文件
      const readmeFile = markdownFiles.find(f => f.toLowerCase() === 'readme.md') 
        || markdownFiles.find(f => f.toLowerCase().startsWith('readme'))
        || markdownFiles[0];
      
      if (readmeFile) {
        const markdownPath = path.join(tempDir, readmeFile);
        const content = fs.readFileSync(markdownPath, 'utf-8');
        return content;
      }

      return '';
    } finally {
      // 6. 清理临时目录
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error(`清理临时目录失败: ${cleanupError.message}`);
      }
    }
  } catch (error) {
    console.error(`获取 npm 包 ${name} 的 README 失败:`, error);
    
    return `# 获取失败\n\n无法获取包 \`${name}\` 的信息。\n\n**错误信息:** ${error.message}\n\n可能的原因：\n- 包名不正确\n- npm registry 服务暂时不可用\n- 网络连接问题\n- tarball 下载或解压失败`;
  }
};

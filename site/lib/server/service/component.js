import AdmZip from 'adm-zip';
import fs from 'node:fs';
import path from 'node:path';

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
  const commits = await http.get(
    'https://api.github.com/repos/TencentBlueKing/bkui-vue3/commits',
    {
      params: {
        path,
      },
    },
  );
  return commits.map(commit => ({
    login: commit.author.login,
    avatar: commit.author.avatar_url,
    timestamp: commit.commit.author.date,
  }));
};

// 获取组件
export const getComponent = async (releaseZipPath, component) => {
  const compiledJsPath = path.resolve(releaseZipPath, component, 'src/compiled.js');
  if (!fs.existsSync(compiledJsPath)) {
    const compiledComponent = await compileComponent(releaseZipPath, component);
    await fs.writeFileSync(compiledJsPath, compiledComponent, 'utf-8');
  }
  return fs.readFileSync(compiledJsPath);
};

// 获取组件 CSS
export const getCss = async (releaseZipPath, component) => {
  const compiledCssPath = path.resolve(releaseZipPath, component, 'src/compiled.css');
  if (!fs.existsSync(compiledCssPath)) {
    const compiledCss = await compileCss(releaseZipPath, component);
    await fs.writeFileSync(compiledCssPath, compiledCss, 'utf-8');
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
  const releaseZipPath = path.resolve(__dirname, `../release-zips/${version}`);
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
      const tempPath = path.resolve(
        __dirname,
        `../release-zips/${version}-temp`,
      );
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
  const releaseZipPath = path.resolve(__dirname, `../release-zips/${version}`);
  if (fs.existsSync(releaseZipPath)) {
    fs.rmSync(releaseZipPath, { recursive: true, force: true });
  }
};

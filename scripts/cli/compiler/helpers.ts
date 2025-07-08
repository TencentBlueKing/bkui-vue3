/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import {
  closeSync,
  createReadStream,
  createWriteStream,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  writeSync,
} from 'fs';
import { join, parse, resolve, normalize } from 'path';

import packageJSON from '../../../package.json';
import { ITaskItem } from '../typings/task';
export const BKUI_DIR = resolve(__dirname, '../../../');
export const COMPONENT_URL = resolve(BKUI_DIR, './packages');
export const PRESET_URL = resolve(BKUI_DIR, './preset');
export const DIST_URL = resolve(BKUI_DIR, './dist');
export const LIB_URL = resolve(BKUI_DIR, './lib');
export const THEME_LESS_URL = resolve(COMPONENT_URL, 'styles/src/themes/themes.less');
export const LOCALE_URL = resolve(COMPONENT_URL, './locale/src/lang');

export const ENV_MAP = {
  'process.env.VERSION': JSON.stringify(packageJSON.version),
};

// 编译转换*.d.ts
export const compilerLibDir = async (dir: string): Promise<void> => {
  const buildDir = (dir: string): void => {
    const files = readdirSync(dir);
    files.forEach((file, index) => {
      const url = join(dir, file);
      if (lstatSync(url).isDirectory()) {
        if (!(/\/src$/.test(dir) && !/\/src$/.test(url))) {
          buildDir(url);
        } else {
          const list = readdirSync(url).filter(url => /\.d.ts$/.test(join(dir, url)));
          list.forEach(file => {
            const fileUrl = join(url, file);
            // 修复路径遍历安全问题
            const normalizedPath = normalize(fileUrl);
            const resolvedPath = resolve(normalizedPath);

            // 确保路径在预期的项目目录内
            if (!resolvedPath.startsWith(BKUI_DIR)) {
              throw new Error(`Path traversal attempt detected: ${resolvedPath}`);
            }

            let chunk = readFileSync(resolvedPath, 'utf-8');
            if (chunk.includes('@bkui-vue')) {
              chunk = chunk.replace('@bkui-vue', fileUrl.split('/src/')[1].replace(/([^/]+)/gim, '..'));
            }
            writeFileRecursive(fileUrl.replace('/src', ''), chunk);
          });
          if (index === files.length - 1) {
            rmdirSync(parse(url).dir, { recursive: true });
          }
        }
      } else if (/\.d.ts$/.test(url)) {
        // 修复路径遍历安全问题
        const normalizedPath = normalize(url);
        const resolvedPath = resolve(normalizedPath);

        // 确保路径在预期的项目目录内
        if (!resolvedPath.startsWith(BKUI_DIR)) {
          throw new Error(`Path traversal attempt detected: ${resolvedPath}`);
        }

        let chunk = readFileSync(resolvedPath, 'utf-8');
        if (/lib\/(bkui-vue|styles\/src)\/(components|index|volar\.components)\.d\.ts$/.test(resolvedPath)) {
          chunk = chunk.replace(/@bkui-vue/gim, resolvedPath.match(/styles\/src\/index.d.ts$/) ? '..' : '.');
          // js/file-system-race
          // writeFileSync(resolvedPath, chunk);
          try {
            const fd = openSync(resolvedPath, 'w');
            writeSync(fd, chunk, 0, 'utf-8');
            closeSync(fd);
          } catch (e) {
            // file existed
          }
        } else if (chunk.match(/@bkui-vue/gim)) {
          if (!resolvedPath.split('/src/')[1]) {
            chunk = chunk.replace(/@bkui-vue/gim, '.');
          } else chunk = chunk.replace(/@bkui-vue/gim, resolvedPath.split('/src/')[1].replace(/([^/]+)/gim, '..'));
        } else if (/\.\.\/icons\//gim.test(chunk) && /lib\/icon\/src\/index\.d\.ts$/.test(resolvedPath)) {
          chunk = chunk.replace(/\.\.\/icons\//gim, '../icon/');
        }
        if (chunk.match(/\/src\//)) {
          const srcList = chunk.match(/(['"])\.\.\/(\.\.\/)?.*src.+\1/gim);
          srcList?.forEach(v => {
            chunk = chunk.replace(v, v.replace('../../', '../').replace('/src', ''));
          });
        }
        writeFileRecursive(resolve(parse(resolvedPath).dir, '../', parse(resolvedPath).base), chunk);
        if (index === files.length - 1) {
          rmdirSync(parse(resolvedPath).dir, { recursive: true });
        }
        // moveFile(url, resolve(parse(url).dir, '../', parse(url).base))
        //   .then(() => {
        //     if (index === files.length - 1) {
        //       rmdirSync(parse(url).dir, { recursive: true });
        //     }
        //   })
        //   .catch(console.error);
      }
    });
  };
  buildDir(dir);
};

// move file
export const moveFile = (oldPath: string, newPath: string) =>
  new Promise((resolve, reject) => {
    const readStream = createReadStream(oldPath);
    const writeStream = createWriteStream(newPath);
    readStream.on('error', err => reject(err));
    writeStream.on('error', err => reject(err));
    writeStream.on('close', () => {
      resolve(undefined);
    });
    readStream.pipe(writeStream);
  });

export const compileFile = (url: string): ITaskItem | undefined => {
  if (/\/dist\/|\.DS_Store|\.bak/.test(url)) {
    return;
  }
  const newPath = url.replace(new RegExp(`${COMPONENT_URL}/([^/]+)/src`), `${LIB_URL}/$1`);
  const isMain = /\/bkui-vue\/.*\.ts$/.test(url);
  if (/\.(css|less|scss)$/.test(url) && !/\.variable.(css|less|scss)$/.test(url)) {
    return {
      type: 'style',
      url,
      newPath,
    };
  }
  if (/\/src\/index\.(js|ts|jsx|tsx)$/.test(url) || isMain) {
    if (isMain) {
      return {
        type: 'script',
        url,
        newPath: LIB_URL,
      };
    }
    return {
      type: 'script',
      url,
      newPath,
    };
  }
  if (/\/icon\/icons\/[^.]+\.(js|ts|jsx|tsx)$/.test(url)) {
    return {
      type: 'script',
      url,
      newPath: url.replace(new RegExp(`${COMPONENT_URL}/([^/]+)/icons`), `${LIB_URL}/$1`),
    };
  }

  return;
};
export const writeFileRecursive = async (url: string, content: string) => {
  let filepath = url.replace(/\\/g, '/');
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3); // c:\
    filepath = filepath.slice(3);
  }

  const folders = filepath.split('/').slice(0, -1); // remove last item, file
  // folders.reduce((acc, folder) => {
  //   const folderPath = `${acc + folder}/`;
  //   if (!existsSync(folderPath)) {
  //     mkdirSync(folderPath);
  //   }
  //   return folderPath;
  // }, root);
  const dirPath = folders.join('/');
  if (dirPath) {
    // 修复 js/file-system-race 问题 - 使用 recursive 选项避免 TOCTOU
    mkdirSync(root + dirPath, { recursive: true });
  }

  // 修复 js/file-system-race 问题 - 使用 openSync 避免 TOCTOU
  const fd = openSync(url, 'w');
  try {
    writeSync(fd, content, 0, 'utf-8');
  } finally {
    closeSync(fd);
  }
};

export const replaceEnvVars = (source: string) => {
  if (!source?.length) return source;
  let replaceSource = source;
  Object.entries(ENV_MAP).forEach(([name, val]) => {
    replaceSource = replaceSource.replace(new RegExp(name, 'gm'), val);
  });
  return replaceSource;
};

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

import {
  lstatSync, appendFile, mkdirSync, existsSync, unlinkSync, readdirSync,
  createReadStream, createWriteStream, rmdirSync, readFileSync, writeFileSync,
} from 'fs';
import { resolve, join, basename, extname, parse } from 'path';
import { promisify } from 'util';
import * as rollup from 'rollup';
import { ICompileTaskOption } from './typings/task';
import { compileStyle, compileTheme } from './compiler/compile-style';
import { rollupBuildScript } from './compiler/compile-script';
import { exec } from 'child_process';
import ora from 'ora';
const compileDirUrl = resolve(__dirname, '../../packages');
const libDirUrl =  resolve(__dirname, '../../lib');
const themeLessUrl = resolve(compileDirUrl, 'styles/src/themes/themes.less');
interface ITaskItem {
  type: 'style' | 'script';
  url: string;
  newPath: string;
}
const writeFileRecursive = async (url: string, content: string) => {
  let filepath = url.replace(/\\/g, '/');
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3);   // c:\
    filepath = filepath.slice(3);
  }

  const folders = filepath.split('/').slice(0, -1);  // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = `${acc + folder}/`;
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      return folderPath;
    },
    root,
  );
  if (existsSync(url)) unlinkSync(url);
  await promisify(appendFile)(url, content, 'utf-8');
};

export const compileFile = (url: string): ITaskItem => {
  if (/\/dist\/|\.DS_Store|\.bak|bkui-vue\/index/.test(url)) {
    return;
  }
  const newPath = url.replace(new RegExp(`${compileDirUrl}/([^/]+)/src`), `${libDirUrl}/$1`);
  if (/\.(css|less|scss)$/.test(url) && !/\.variable.(css|less|scss)$/.test(url)) {
    return {
      type: 'style',
      url,
      newPath,
    };
  } if (/\/src\/index\.(js|ts|jsx|tsx)$/.test(url)) {
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
      newPath: url.replace(new RegExp(`${compileDirUrl}/([^/]+)/icons`), `${libDirUrl}/$1`),
    };
  }
  return;
};

export const compilerDir = async (dir: string): Promise<any> => {
  // const urlList: any = [];
  const list: ITaskItem[] = [];
  const buildDir: any = (dir: string) => {
    const files = readdirSync(dir);
    files.forEach((file) => {
      const url = join(dir, file);
      if (/(node_modules|__test__|\.test\.*)/.test(url)) {
        return ;
      }
      if (lstatSync(url).isDirectory()) {
        buildDir(url);
      }
      const data = compileFile(url);
      data && list.push(data);
    });
  };
  buildDir(dir);
  const taskInstance = new CompileTask(list);
  taskInstance.start();
};
// move file
export const moveFile = (oldPath, newPath) => new Promise((resolve, reject) => {
  const readStream = createReadStream(oldPath);
  const writeStream = createWriteStream(newPath);
  readStream.on('error', err => reject(err));
  writeStream.on('error', err => reject(err));
  writeStream.on('close', () => {
    resolve(undefined);
  });
  readStream.pipe(writeStream);
});
// 编译转换*.d.ts
export const compilerLibDir = async (dir: string): Promise<any> => {
  const buildDir: any = (dir: string) => {
    const files = readdirSync(dir);
    const list = files.filter(url =>  /\.d.ts$/.test(join(dir, url)));
    (list.length ? list : files).forEach((file, index) => {
      const url = join(dir, file);
      if (list.length) {
        if (/lib\/(bkui-vue|styles\/src)\/(components|index)\.d\.ts$/.test(url)) {
          let chunck = readFileSync(url, 'utf-8');
          chunck = chunck.replace(/@bkui-vue/gmi, url.match(/styles\/src\/index.d.ts$/) ? '..' : '.');
          writeFileSync(url, chunck);
        }
        moveFile(url, resolve(parse(url).dir, '../', parse(url).base))
          .then(() => {
            if (index === list.length - 1) {
              rmdirSync(parse(url).dir, { recursive: true });
            }
          })
          .catch(console.error);
      } else if (lstatSync(url).isDirectory()) {
        buildDir(url);
      }
    });
  };
  buildDir(dir);
};


// 将theme.less 装换为 css变量
const compileThemeTovariable = async () => {
  const resource = await compileTheme(themeLessUrl);
  await writeFileRecursive(themeLessUrl.replace(/\.(css|less|scss)$/, '.variable.$1'), resource);
};

class CompileTask {
  globals: Record<string, string>;
  constructor(public taskItemList: ITaskItem[]) { }

  async getRollupGlobals() {
    const { stdout } = await promisify(exec)('yarn workspaces info --json');
    const globals: rollup.GlobalsOption = {};
    Object.keys(JSON.parse(stdout)).forEach((k) => {
      if (k === '@bkui-vue/icon') {
        globals[k] = `${k}/icons`;
      } else {
        globals[k] = k.replace(
          /^@bkui-vue\/(\w+)$/,
          (_char, match) => match.replace(/^\S/, (s: string) => s.toUpperCase()),
        );
      }
    });
    globals.vue = 'Vue';
    globals['vue-types'] = 'vue-types';
    this.globals = globals;
  }
  async compileStyle({ url, newPath }: ITaskItem) {
    const spinner = ora(`building style ${url} \n`).start();
    const { css, resource, varCss } = await compileStyle(url).catch(() => ({
      css: '',
      resource: '',
      varCss: '',
    }));
    css.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.css'), css);
    resource.length && writeFileRecursive(newPath, resource);
    varCss.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.variable.css'), varCss);
    css.length ? spinner.succeed() : spinner.fail();
    this.pushTask();
  }
  async compileScript({ url, newPath }: ITaskItem) {
    if (!this.globals) {
      await this.getRollupGlobals();
    }
    const spinner = ora(`building script ${url} \n`).start();
    if (basename(url).replace(extname(url), '') === 'index' || /\/icon\/icons\//.test(url)) {
      rollupBuildScript(url, newPath.replace(/\.(js|ts|jsx|tsx)$/, '.js'), this.globals)
        .catch(() => spinner.fail())
        .then(() => spinner.succeed())
        .finally(() => {
          spinner.stop();
          spinner.clear();
          this.pushTask();
        });
    } else {
      spinner.succeed();
      spinner.stop();
      spinner.clear();
      this.pushTask();
    }
  }
  start(parallelNumber = 5) {
    const startList = this.taskItemList.splice(0, parallelNumber);
    startList.forEach(item => this.complieTask(item));
  }
  complieTask(item: ITaskItem) {
    item.type === 'style' ? this.compileStyle(item) : this.compileScript(item);
  }
  pushTask() {
    const [item] = this.taskItemList.splice(0, 1);
    item && this.complieTask(item);
  }
}

export default async (option: ICompileTaskOption) => {
  if (option.compile) {
    compilerLibDir(libDirUrl);
    await compileThemeTovariable();
    compilerDir(compileDirUrl);
  }
};

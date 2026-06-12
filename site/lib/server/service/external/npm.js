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
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { extract } from 'tar';

import http from '../../util/http';
import { validateNpmPackageName } from '../validate';

// 下载 tarball 并解压到目标目录（自动跟随一次 301/302 重定向）
const downloadAndExtractTarball = (url, destDir) => new Promise((resolve, reject) => {
  https
    .get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadAndExtractTarball(response.headers.location, destDir).then(resolve, reject);
        return;
      }
      response
        .pipe(extract({ cwd: destDir, strip: 1 })) // strip 去掉 package/ 前缀
        .on('finish', resolve)
        .on('error', reject);
    })
    .on('error', reject);
});

// 在目录中查找首选的 markdown 文件（优先 README.md）
const findReadme = (dir) => {
  const markdownFiles = fs.readdirSync(dir).filter(file => file.toLowerCase().endsWith('.md'));
  return markdownFiles.find(f => f.toLowerCase() === 'readme.md')
    || markdownFiles.find(f => f.toLowerCase().startsWith('readme'))
    || markdownFiles[0];
};

// 获取 npm 包根目录的 README markdown 内容
export const getNpmMarkdown = async (name) => {
  const validatedName = validateNpmPackageName(name);

  try {
    const packageInfo = await http.get(`https://registry.npmjs.org/${validatedName}/latest`);
    const tarballUrl = packageInfo.dist?.tarball;

    // 只允许从 npmjs.org 下载
    if (!tarballUrl.includes('registry.npmjs.org')) {
      throw new global.BusinessError('Invalid tarball URL', 400, 400);
    }

    const tempDir = path.join(os.tmpdir(), `npm-${validatedName.replace(/\//g, '-')}-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      await downloadAndExtractTarball(tarballUrl, tempDir);

      const readmeFile = findReadme(tempDir);
      if (readmeFile) {
        return fs.readFileSync(path.join(tempDir, readmeFile), 'utf-8');
      }
      return '';
    } finally {
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

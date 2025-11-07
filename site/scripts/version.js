/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

/**
 * 版本发布脚本
 * @description 用于文档站同步组件库版本
 * @author bk-fe
 * @date 2025-11-06
 * @version 1.0.0
 * @copyright Tencent
 */
require('@babel/register');
const path = require('path');
const fs = require('fs');
const { RELEASE_DIR, RELEASE_DIST_DIR, COMPILE_JS_FILE, COMPILE_CSS_FILE } = require('../lib/server/common');
const { compileComponent, compileCss, compileDemo } = require('../lib/server/service/compile');
const { getDistFilePath } = require('../lib/server/service/component');

/**
 * 增加版本
 * @description 将当前组件库复制到 release-dir/[version] 目录下
 * @author bk-fe
 * @date 2025-11-06
 * @version 1.0.0
 * @copyright Tencent
 */
const plusVersion = () => {
  const packageJson = require('../../package.json');
  fs.cpSync(path.resolve(__dirname, '../../packages'), path.resolve(RELEASE_DIR, packageJson.version), { recursive: true });
};

/**
 * 构建版本
 * @description 构建当前组件库版本
 * @author bk-fe
 * @date 2025-11-06
 * @version 1.0.0
 * @copyright Tencent
 */
const releaseVersion = async () => {
  const packageJson = require('../../package.json');
  const releaseDistPath = path.resolve(RELEASE_DIST_DIR, packageJson.version);
  const releaseZipPath = path.resolve(RELEASE_DIR, packageJson.version);
  const componentPaths = fs.readdirSync(releaseZipPath);
  // 构建组件
  for (const componentPath of componentPaths) {
    // 存在demo的需要编译
    if (fs.existsSync(path.resolve(releaseZipPath, componentPath, 'demo')) && componentPath !== 'directives') {
      // 编译demo
      await compileDemo(releaseZipPath, path.resolve(releaseZipPath, componentPath, 'demo/index.ts'));
      // 编译组件
      const compiledComponent = await compileComponent(releaseZipPath, componentPath, 'component');
      const compiledJsPath = getDistFilePath(packageJson.version, componentPath, 'component', COMPILE_JS_FILE);
      // 编译组件css
      const compiledCss = await compileCss(releaseZipPath, componentPath, 'component');
      const compiledCssPath = getDistFilePath(packageJson.version, componentPath, 'component', COMPILE_CSS_FILE);
      // 写入文件
      fs.writeFileSync(compiledJsPath, compiledComponent);
      fs.writeFileSync(compiledCssPath, compiledCss);
    }
  }
  // 构建指令
  const directivePaths = fs.readdirSync(path.resolve(releaseZipPath, 'directives/demo'));
  for (const directivePath of directivePaths) {
    // 编译demo
    await compileDemo(releaseZipPath, path.resolve(releaseZipPath, 'directives/demo', directivePath));
    // 编译指令
    const compiledDirective = await compileComponent(releaseZipPath, path.basename(directivePath, path.extname(directivePath)), 'directive');
    const compiledJsPath = getDistFilePath(packageJson.version, path.basename(directivePath, path.extname(directivePath)), 'directive', COMPILE_JS_FILE);
    // 写入文件
    fs.writeFileSync(compiledJsPath, compiledDirective);
  }
};

// 执行
(async () => {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  🚀 BKUI-VUE 文档站新增版本`);
    console.log(`${'='.repeat(60)}\n`);

    await plusVersion();
    await releaseVersion();

    console.log(`${'='.repeat(60)}`);
    console.log(`  ✨ 文档站新增版本完成！`);
    console.log(`${'='.repeat(60)}\n`);
  } catch (error) {
    console.error(`\n❌ 执行失败:`, error);
    process.exit(1);
  }
})();

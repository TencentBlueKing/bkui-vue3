/**
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

const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const basePath = path.resolve(__dirname, './packages');
const packages = readdirSync(basePath).filter(name => lstatSync(path.join(basePath, name)).isDirectory());

module.exports = {
  // testURL: 'http://localhost/',
  testEnvironmentOptions: {
    url: 'http://localhost/',
    customExportConditions: ['node', 'node-addons'],
  },
  setupFiles: [path.resolve(__dirname, './scripts/cli/test-setup.ts')],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'packages/**/*.{jsx,vue,tsx}',
    '!packages/*/style/index.{js,jsx,tsx}',
    '!packages/style/*.{js,jsx}',
    '!packages/coverage/**',
    '!packages/*/locale/*.{js,jsx}',
    '!packages/*/__tests__/**/type.{js,jsx,tsx}',
    '!packages/style.ts',
    '!**/node_modules/**',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'vue', 'node'],
  testPathIgnorePatterns: ['node_modules', 'node', 'bak'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        '@bkui-vue/popover': path.resolve(__dirname, './packages/popover/src/index.ts'),
        [`@bkui-vue/${name}(.*)$`]: path.resolve(__dirname, `./packages/${name}/src/$1`),
      }),
      {},
    ),
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(vue|md)$': path.resolve(__dirname, './node_modules/@vue/vue3-jest'),
    '^.+\\.(js)$': path.resolve(__dirname, './node_modules/babel-jest'),
    // '^.+\\.(ts|tsx)$': path.resolve(__dirname, './node_modules/ts-jest'),
    '^.+\\.(ts|tsx)$': [path.resolve(__dirname, './node_modules/ts-jest'), {
      babelConfig: path.resolve(__dirname, './babel.config.js'),
      tsconfig: path.resolve(__dirname, './packages/tsconfig.json'),
    }],
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': path.resolve(__dirname, './node_modules/jest-transform-stub'),
  },
  transformIgnorePatterns: ['node_modules', 'dist', 'bak'],
  testRegex: '.*\\.test\\.(js|ts|tsx)$',
  // globals: {
  //   'ts-jest': {
  //     babelConfig: path.resolve(__dirname, './babel.config.js'),
  //     tsconfig: path.resolve(__dirname, './packages/tsconfig.json'),
  //   },
  // },
};

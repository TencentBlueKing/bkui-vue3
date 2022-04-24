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

// get listing of packages in mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => lstatSync(path.join(basePath, name)).isDirectory());

module.exports = {
  // preset: "ts-jest",
  // testEnvironment: "node",
  // moduleNameMapper: {
  //   "^.+\\.(css|less|scss)$": "babel-jest",
  //   // automatically generated list of our packages from packages directory.
  //   // will tell jest where to find source code for @bkui-vue/ packages, it points to the src instead of dist.
  //   ...packages.reduce(
  //     (acc, name) => ({
  //       ...acc,
  //       [`@bkui-vue/${name}(.*)$`]: `<rootDir>/packages/./${name}/src/$1`,
  //     }),
  //     {}
  //   ),
  // },
  // modulePathIgnorePatterns: [
  //   ...packages.reduce(
  //     (acc, name) => [...acc, `<rootDir>/packages/${name}/dist`],
  //     []
  //   ),
  //   'bak'
  // ]

  testURL: 'http://localhost/',
  setupFiles: ['./scripts/cli/test-setup.ts'],
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
    '^@/(.*)$': '<rootDir>/$1',
    // '^@bkui-vue/(.*)$': '<rootDir>/src/components/$1',
    '^.+\\.(css|less|scss)$': 'babel-jest',
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@bkui-vue/${name}(.*)$`]: `<rootDir>/packages/${name}/src/$1`,
      }),
      {},
    ),
  },
  modulePathIgnorePatterns: [
    ...packages.reduce(
      (acc, name) => [...acc, `<rootDir>/packages/${name}/dist`],
      [],
    ),
  ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(vue|md)$': '<rootDir>/node_modules/@vue/vue3-jest',
    '^.+\\.(js|jsx|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': '<rootDir>/node_modules/jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules', 'dist', 'bak'],
  testRegex: '.*\\.test\\.(js|ts|tsx)$',
  globals: {
    'ts-jest': {
      babelConfig: './babel.config.js',
      tsconfig: './packages/tsconfig.test.json'
    },
  },
};

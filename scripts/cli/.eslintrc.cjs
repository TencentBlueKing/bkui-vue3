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
module.exports = {
  root: true,
  extends: [
    'eslint-config-tencent',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2019,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  plugins: ['codecc', 'simple-import-sort', 'prettier'],
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  overrides: [
    {
      files: ['*.js'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:prettier/recommended'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
            checksVoidReturn: false,
            checksSpreads: false,
          },
        ],
        'max-len': [
          'error',
          {
            code: 120,
            ignoreStrings: true,
            ignoreUrls: true,
            ignoreRegExpLiterals: true,
            ignoreTemplateLiterals: true,
          },
        ],
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['eslint-config-tencent/ts', 'plugin:prettier/recommended'],
      rules: {
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
            checksVoidReturn: false,
            checksSpreads: false,
          },
        ],
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    {
      files: [
        '**/__test__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  rules: {
    'simple-import-sort/imports': ['error', {
      groups: [
        ['^[a-zA-Z]'],
        ['^@\\w'],
        ['^\\.\\.'],
        ['^\\.'],
      ],
    }],
    'no-param-reassign': ['error', { props: false }],

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'codecc/license': ['error', {
      license: `/*
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
*/\n`,
      pattern: 'Tencent is pleased to support the open source community',
    }],
    // 'codecc/comment-ratio': ['error', 10],
    'codecc/comment-ratio': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      },
    ]
  },
};

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
import path, { basename, extname, parse } from 'path';
import webpack, { Stats } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { ILibTaskOption, ITaskItem } from '../typings/task';

import bkuiBabelPlugin from './babel-plugin';
import { LIB_URL } from './helpers';
// import IgnorePlugin from './ignore-not-found';
// import lessFixLoader from './less-fix-loader';
import WebpackCheckPlugin from './webpack-plugin';
const prefix = '@bkui-vue/';
export const webpackBuildScript = async (entryList: ITaskItem[], taskOption: ILibTaskOption) => {
  const entry: webpack.EntryObject = {};
  entryList.forEach(({ url, newPath }) => {
    if (newPath === LIB_URL) {
      const urlInfo = parse(url);
      if (!urlInfo.name.match(/dist\.index\.ts$|volar\.components/)) {
        entry[`main-${urlInfo.name}`] = url;
      }
    } else if (url && !url.match(/\/styles\//)) {
      if (basename(url).replace(extname(url), '') === 'index' || /\/icon\/icons\//.test(url)) {
        let name = url.match(/\/([^/]+)\/src\//)?.[1];
        if (!name) {
          const icon = url.match(/\/icons\/(.+)\.tsx?$/)?.[1];
          name = icon && icon !== 'icon' ? `icon-${icon}` : '';
        }
        name && (entry[name] = url);
      }
    }
  });
  const compiler = webpack({
    mode: 'production',
    entry,
    output: {
      filename: (pathData: any) => {
        const { name } = pathData.chunk;
        if (/^icon-/.test(name)) {
          return `icon/${name.replace('icon-', '')}.js`;
        }
        if (/^main-/.test(name)) {
          return `${name.replace(/^main-/, '')}.js`;
        }
        return `${pathData.chunk.name}/index.js`;
      },
      path: LIB_URL,
      // chunkFilename: (pathData: any) => {
      //   console.info(pathData);
      //   return `${pathData.chunk.runtime}`;
      // },
      library: {
        type: 'module',
      },
      environment: {
        module: true,
      },
      chunkFormat: 'module',
      module: true,
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimize: false,
      mangleExports: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: false,
                    },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: [bkuiBabelPlugin, '@vue/babel-plugin-jsx', '@babel/plugin-transform-runtime'],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: false, // Set to true if you are using fork-ts-checker-webpack-plugin
                projectReferences: true,
                configFile: path.resolve(__dirname, '../tsconfig.component.json'),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 65536,
            outputPath: 'img',
            name: '[name][hash:7].[ext]',
            fallback: 'file-loader',
            esModule: false,
          },
        },
        // {
        //   test: /\.css$/,
        //   loader: path.resolve(__dirname, './less-fix-loader.ts'),
        // },
        {
          test: /\.css$/,
          loader: 'css-loader',
        },
      ],
    },
    externalsType: 'module',
    externals: [
      '@popperjs/core',
      'date-fns',
      'js-calendar',
      /^lodash\/.*/,
      'vue',
      'highlight.js',
      'vue-types',
      ({ request, context }, cb) => {
        if (context && request && /\/bkui-vue$/.test(context)) {
          return cb(undefined, request.replace(prefix, './'));
        }
        // if (request?.startsWith('@bkui-style/')) {
        //   return cb(undefined, request.replace('@bkui-style/', '../'), 'window');
        // }
        if (request?.startsWith(prefix) && !/\.(less|css)$/.test(request)) {
          return cb(undefined, request.replace(prefix, '../'));
        }
        cb();
      },
      /^bkui-vue\/.*/,
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      // new IgnorePlugin('@bkui-style'),
      new WebpackCheckPlugin(),
      taskOption.analyze
        ? new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
          })
        : undefined,
      new webpack.ProgressPlugin(),
    ].filter(Boolean) as any,
    target: ['web', 'es2020'],
  });
  return new Promise<void>((resolve, reject) => {
    compiler.run((err: Error | null | undefined, stats: Stats | undefined) => {
      if (err) {
        console.log(err);
        reject(err.message);
        return;
      }
      if (stats?.hasErrors()) {
        stats.compilation.errors.forEach(e => {
          console.error(e.message);
        });
        reject('Build failed');
      }
      console.log('\n', stats?.toString({ colors: true }), '\n');
      !taskOption.analyze && resolve();
    });
  });
};

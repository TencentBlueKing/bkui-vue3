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
import path, { basename, extname } from 'path';
import webpack from 'webpack';

import { ITaskItem } from '../typings/task';

export const webpackBuildScript = async (entryList: ITaskItem[]) => {
  const entry: webpack.EntryObject = {};
  entryList.forEach(({ url }) => {
    if (url && !url.includes('/styles/')
     && (basename(url).replace(extname(url), '') === 'index' || /\/icon\/icons\//.test(url))) {
      let name = url.match(/\/([^/]+)\/src\//)?.[1];
      if (!name) {
        const icon = url.match(/\/icons\/(.+)\.tsx?$/)?.[1];
        name = icon && icon !== 'icon' ? `icon-${icon}` : '';
      }
      name && (entry[name] = url);
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
        return `${pathData.chunk.name}/${pathData.chunk.name}.js`;
      },
      path: '/Users/liangling/code/githubCode/bkui-vue3/lib',
      // chunkFilename: (pathData: any) => {
      //   console.info(pathData);
      //   return `${pathData.chunk.runtime}`;
      // },
      libraryTarget: 'umd',
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
                  ],
                  '@vue/babel-preset-jsx',
                ],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: false, // Set to true if you are using fork-ts-checker-webpack-plugin
                projectReferences: true,
                configFile: path.resolve(__dirname, '../../tsconfig.component.json'),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'img',
            name: '[name][hash:7].[ext]',
            fallback: 'file-loader',
            esModule: false,
          },
        },
      ],
    },
    externals: [
      '@popperjs/core',
      'date-fns',
      'js-calendar',
      'lodash',
      'vue',
      'highlight.js',
      'vue-types',
      ({ request }, cb)  => {
        const prefix = '@bkui-vue/';
        if (request.includes('@babel/')) {
          return cb(null, request);
        }
        if (request.indexOf(prefix) === 0) {
          return cb(null, request.replace(prefix, '../'));
        }
        cb();
      },
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.ProgressPlugin(),
    ],
  });
  return new Promise<void>((resolve, reject) => {
    compiler.run((err: Error, stats: webpack.Stats) => {
      if (err) {
        console.info(err);
        reject(err.message);
        return;
      }
      if (stats.hasErrors()) {
        stats.compilation.errors.forEach((e) => {
          console.log(e.message);
        });

        reject('Build failed');
      }
      console.log('\n', stats.toString({ colors: true }), '\n');
      resolve();
    });
  });
};


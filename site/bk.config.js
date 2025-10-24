
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

const chokidar = require('chokidar');
const path = require('path');

module.exports = {
  assetsDir: './lib/client/static',
  outputDir: './lib/client/dist',
  port: process.env.BK_APP_PORT,
  host: process.env.BK_APP_HOST,
  publicPath: process.env.BK_STATIC_URL,
  typescript: true,
  bundleAnalysis: false,
  replaceStatic: true,
  parseNodeModules: false,
  copy: {
    from: './lib/client/static',
    to: './lib/client/dist/static',
  },
  resource: {
    main: {
      entry: './lib/client/src/main.ts',
      html: {
        filename: 'index.html',
        template: './lib/client/index.html',
      },
    },
  },
  // webpack config 配置
  configureWebpack() {
    const serverAddress = `http://${process.env.BK_APP_HOST}:${process.env.BK_APP_PORT - 1}`;
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './lib/client/src'),
        },
      },
      devServer: {
        proxy: [
          {
            context(path) {
              const proxyRegs = [
                /^\/api/,
              ];
              return proxyRegs.some(reg => reg.test(path));
            },
            target: serverAddress,
          },
        ],
        setupMiddlewares: (middlewares, devServer) => {
          if (!devServer) {
            throw new Error('webpack-dev-server is not defined');
          }

          // 监听目标文件夹
          const watcher = chokidar.watch(path.resolve(__dirname, '../packages'));
          watcher.on('all', () => {
            // 通知前端
            devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed');
          });

          return middlewares;
        },
      },
    };
  },
  chainWebpack (config) {
    config.module.rule('md')
        .test(/\.md/)
        .set('type', 'asset/source')
    return config;
  },
};

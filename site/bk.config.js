
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
};

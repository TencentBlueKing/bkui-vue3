/* eslint-disable @typescript-eslint/no-require-imports */
require('reflect-metadata');
require('@babel/register');
require('./custom-global');
const http = require('http');
const { resolve } = require('path');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const koaStatic = require('koa-static');
const views = require('co-views');
const koaMount = require('koa-mount');
const chalk = require('chalk');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const convert = require('koa-convert');

const { logger } = require('./logger');
const { routes, allowedMethods } = require('./router');

const { CODE } = require('./util');

async function startServer() {
  const IS_DEV = process.env.NODE_ENV === 'development';
  const PORT = IS_DEV ? process.env.BK_APP_PORT - 1 : process.env.BK_APP_PORT;

  const app = new Koa();

  // 统一处理，
  // @see https://github.com/koajs/koa/wiki/Error-Handling
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const { status } = err;
      const message = err.message || '服务器内部出错';

      // 程序出错异常
      if (CODE.HTTP.indexOf(status)) {
        ctx.status = err.status || 500;
        ctx.body = {
          code: err.status,
          message,
        };
      } else {
        const code = err.code || CODE.BIZ.NOT_DEFINED;
        ctx.body = {
          code,
          message,
        };
      }
      ctx.app.emit('error', err, ctx);
    }
  });
  app.on('error', (err) => {
    logger.error(err.message || err);
  });

  app.use(bodyparser());
  app.use(json());

  app.use(koaMount('/static', koaStatic(resolve(__dirname, '..', IS_DEV ? 'client/static' : 'client/dist/static'))));

  app.use(convert.compose(routes));
  app.use(convert.compose(allowedMethods));

  app.context.render = views(resolve(__dirname, '..', IS_DEV ? 'client' : 'client/dist'), {
    map: { html: 'swig' },
  });

  app.use(historyApiFallback({
    verbose: false,
    whiteList: ['/api'],
    rewrites: [
      {
        // connect-history-api-fallback 默认会对 url 中有 . 的 url 当成静态资源处理而不是当成页面地址来处理
        // from: /\d+\.\d+\.\d+\.\d+$/,
        from: /\/(\d+\.)*\d+$/,
        to: '/',
      },
      {
        // connect-history-api-fallback 默认会对 url 中有 . 的 url 当成静态资源处理而不是当成页面地址来处理
        from: /\/\/+.*\..*\//,
        to: '/',
      },
    ],
  }));

  const server = http.createServer(app.callback());
  server.listen(PORT);

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof PORT === 'string' ? (`Pipe ${PORT}`) : `Port ${PORT}`;

    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const addr = server.address();
    console.log(chalk.cyan(`Listening at http://localhost:${addr.port}`));
  });
}

startServer();
